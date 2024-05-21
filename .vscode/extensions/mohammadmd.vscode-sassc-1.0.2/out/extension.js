"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const sm = require("source-map");
const util_1 = require("./util/util");
const sassHelper_1 = require("./util/sassHelper");
const sass_1 = require("sass");
function activate(context) {
    if (vscode.workspace.name) {
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 4);
        statusBarItem.command = "vscode-sassc.compileProject";
        statusBarItem.text = "$(zap) Compile Project";
        statusBarItem.tooltip = "SASS/SCSS";
        context.subscriptions.push(statusBarItem);
        util_1.checkForSassConfig(statusBarItem);
        const createFileListener = vscode.workspace.onDidCreateFiles(() => {
            util_1.checkForSassConfig(statusBarItem);
        });
        const deleteFileListener = vscode.workspace.onDidDeleteFiles(() => {
            util_1.checkForSassConfig(statusBarItem);
        });
        const renameFileListener = vscode.workspace.onDidRenameFiles(() => {
            util_1.checkForSassConfig(statusBarItem);
        });
    }
    context.subscriptions.push(vscode.commands.registerCommand("vscode-sassc.singleCompilationCompileCurrentFile", async () => {
        const items = [
            { label: "Live View", detail: "View and navigate compiled css as you edit" },
            { label: "Compile To Output", detail: "Compile to vscode output channel" },
            { label: "Compile Across Current File", detail: "Compile and save next to current file" },
            { label: "Compile To File...", detail: "Compile and save it anywhere of your choice" },
        ];
        const selection = await vscode.window.showQuickPick(items, {
            canPickMany: false,
            placeHolder: "Choose how to compile",
            title: "Compile Current File",
        });
        if (!selection)
            return;
        const isUntitled = vscode.window.activeTextEditor.document.isUntitled;
        const isIndentedSyntax = vscode.window.activeTextEditor.document.languageId === "sass";
        let fileName;
        if (isUntitled)
            fileName = vscode.window.activeTextEditor.document.fileName;
        else
            fileName = path.basename(vscode.window.activeTextEditor.document.fileName);
        switch (selection.label) {
            case items[0].label:
                const liveViewWebView = vscode.window.createWebviewPanel("css-live-view", `LiveView: ${fileName}`, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false }, { enableScripts: true });
                const htmlFilePath = util_1.getFileUri(context, "res/html/LiveView.html").fsPath;
                const script1FilePath = liveViewWebView.webview.asWebviewUri(util_1.getFileUri(context, "res/dist/highlight.min.js"));
                const script2FilePath = liveViewWebView.webview.asWebviewUri(util_1.getFileUri(context, "res/dist/css.min.js"));
                const styleFilePath = liveViewWebView.webview.asWebviewUri(util_1.getFileUri(context, `res/dist/styles/${util_1.getThemeName()}.min.css`));
                let htmlFileContent = fs.readFileSync(htmlFilePath).toString();
                htmlFileContent = htmlFileContent.replace("{{style}}", styleFilePath.toString());
                htmlFileContent = htmlFileContent.replace("{{script1}}", script1FilePath.toString());
                htmlFileContent = htmlFileContent.replace("{{script2}}", script2FilePath.toString());
                liveViewWebView.webview.html = htmlFileContent;
                let compiledCode = sassHelper_1.compileSassText(vscode.window.activeTextEditor.document.getText(), isIndentedSyntax);
                liveViewWebView.webview.postMessage({
                    kind: "code",
                    code: compiledCode instanceof Error ? compiledCode.message : compiledCode.css.toString(),
                });
                const documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
                    if (event.document !== vscode.window.activeTextEditor?.document) {
                        liveViewWebView.dispose();
                        return;
                    }
                    compiledCode = sassHelper_1.compileSassText(event.document.getText(), isIndentedSyntax);
                    try {
                        liveViewWebView.webview.postMessage({
                            kind: "code",
                            code: compiledCode instanceof Error ? compiledCode.message : compiledCode.css.toString(),
                        });
                    }
                    catch {
                        documentChangeListener.dispose();
                    }
                });
                const cursorChangeListener = vscode.window.onDidChangeTextEditorSelection(async (event) => {
                    if (event.textEditor.document !== vscode.window.activeTextEditor?.document) {
                        liveViewWebView.dispose();
                        return;
                    }
                    if (compiledCode instanceof Error)
                        return;
                    const mapping = await sm.SourceMapConsumer.with(compiledCode.map.toString(), null, (consumer) => {
                        return consumer.generatedPositionFor({
                            source: consumer.sources[0],
                            line: event.textEditor.selection.active.line + 1,
                            column: event.textEditor.selection.active.character,
                        });
                    });
                    try {
                        liveViewWebView.webview.postMessage({
                            kind: "highlight",
                            highlight: mapping,
                        });
                    }
                    catch {
                        cursorChangeListener.dispose();
                    }
                });
                break;
            case items[1].label:
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    cancellable: false,
                    title: "Compiling...",
                }, () => {
                    const outputChannel = vscode.window.createOutputChannel(`SASSC: ${fileName}`);
                    const compileOutput = sassHelper_1.compileSassText(vscode.window.activeTextEditor.document.getText(), isIndentedSyntax);
                    outputChannel.append(compileOutput instanceof Error ? compileOutput.message : compileOutput.css.toString());
                    outputChannel.show();
                    return Promise.resolve();
                });
                break;
            case items[2].label:
                if (isUntitled) {
                    vscode.window.showWarningMessage("Please save this file before using this action.");
                    return;
                }
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    cancellable: false,
                    title: "Compiling...",
                }, async () => {
                    if (vscode.window.activeTextEditor.document.isDirty)
                        await vscode.window.activeTextEditor.document.save();
                    const compiledCode = sassHelper_1.compileSassText(vscode.window.activeTextEditor.document.getText(), isIndentedSyntax);
                    const newFilePath = path.join(path.dirname(vscode.window.activeTextEditor.document.fileName), sassHelper_1.getCssFileName(fileName));
                    fs.writeFileSync(newFilePath, compiledCode instanceof Error ? compiledCode.message : compiledCode.css);
                    return Promise.resolve();
                });
                break;
            case items[3].label:
                const dest = await vscode.window.showSaveDialog({ title: "Compile To File...", filters: { css: ["css"] } });
                if (!dest)
                    return;
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    cancellable: false,
                    title: "Compiling...",
                }, () => {
                    const compiledCode = sassHelper_1.compileSassText(vscode.window.activeTextEditor.document.getText(), isIndentedSyntax);
                    fs.writeFileSync(dest.fsPath, compiledCode instanceof Error ? compiledCode.message : compiledCode.css);
                    return Promise.resolve();
                });
                break;
        }
    }), vscode.commands.registerCommand("vscode-sassc.compileProject", async () => {
        const sassConfigFiles = (await vscode.workspace.findFiles("**/sassconfig.json")).map((uri) => {
            return uri.fsPath;
        });
        let sassConfigPath;
        if (sassConfigFiles.length > 1) {
            const items = sassConfigFiles.map((item, i) => {
                return {
                    label: path.relative(vscode.workspace.workspaceFolders[0].uri.fsPath, item),
                    description: i.toString(),
                    detail: item,
                };
            });
            const selection = await vscode.window.showQuickPick(items, {
                canPickMany: false,
                title: "Compile Project",
                placeHolder: "Choose sassconfig root",
            });
            if (!selection)
                return;
            sassConfigPath = sassConfigFiles[+selection.description];
        }
        else {
            sassConfigPath = sassConfigFiles[0];
        }
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
        }, async (progress) => {
            progress.report({ message: "Compiling...", increment: 33 });
            const sassSearchLocation = path.relative(vscode.workspace.workspaceFolders[0].uri.fsPath, path.join(path.dirname(sassConfigPath), "**/*.{sass,scss}"));
            const sassFiles = (await vscode.workspace.findFiles(sassSearchLocation)).map((uri) => {
                return uri.fsPath;
            });
            const sassConfig = JSON.parse(fs.readFileSync(sassConfigPath).toString());
            progress.report({ increment: 33 });
            await sassHelper_1.compileProject(sassFiles, sassConfig, path.dirname(sassConfigPath));
            progress.report({ message: "Done!", increment: 34 });
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        });
    }), vscode.commands.registerCommand("vscode-sassc.watchProject", async ({ fsPath }) => {
        if (sassHelper_1.getActiveWatches().includes(fsPath)) {
            vscode.window.showWarningMessage("This project is already added to watches!");
            return;
        }
        const sassConfig = JSON.parse(fs.readFileSync(fsPath).toString());
        await sassHelper_1.watchProject(fsPath, sassConfig);
        vscode.window.showInformationMessage("Project successfully added to watches!");
    }), vscode.commands.registerCommand("vscode-sassc.showActiveWatches", () => {
        const _this = this;
        if (typeof _this.outputChannel === "undefined") {
            _this.outputChannel = vscode.window.createOutputChannel("Active Watches");
        }
        const activeWatches = sassHelper_1.getActiveWatches();
        _this.outputChannel.clear();
        if (activeWatches.length > 0)
            activeWatches.forEach((watch) => _this.outputChannel.appendLine(watch));
        else
            _this.outputChannel.appendLine("No active watches.");
        _this.outputChannel.show();
    }), vscode.commands.registerCommand("vscode-sassc.destroyWatch", async () => {
        const activeWatches = sassHelper_1.getActiveWatches();
        if (activeWatches.length === 0) {
            vscode.window.showInformationMessage("No active Watches.");
            return;
        }
        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const items = activeWatches.map((watch, i) => {
            return {
                label: path.relative(workspaceRoot, watch),
                detail: watch,
                description: i.toString(),
            };
        });
        const selection = await vscode.window.showQuickPick(items, {
            canPickMany: false,
            title: "Destroy Watch",
            placeHolder: "Choose watch to destroy...",
        });
        if (!selection)
            return;
        sassHelper_1.destroyWatch(activeWatches[+selection.description]);
        vscode.window.showInformationMessage("Watch destroyed.");
    }), vscode.commands.registerCommand("vscode-sassc.api.render", (options) => {
        try {
            return sass_1.renderSync(options);
        }
        catch (error) {
            return error;
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map