"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTreeViewCommands = void 0;
const path = require("path");
const vscode_1 = require("vscode");
const constants_1 = require("../../constants");
const store_1 = require("../../store");
const utils_1 = require("../../utils");
const activeSwing_1 = require("./activeSwing");
function registerTreeViewCommands(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand(`${constants_1.EXTENSION_NAME}.addSwingFile`, async (node) => {
        const file = await vscode_1.window.showInputBox({
            placeHolder: "Enter the name of the file you'd like to add",
        });
        if (!file) {
            return;
        }
        const filePath = node ? `${node.directory}/${file}` : file;
        const uri = vscode_1.Uri.joinPath(store_1.store.activeSwing.rootUri, filePath);
        await vscode_1.workspace.fs.writeFile(uri, new Uint8Array());
        vscode_1.window.showTextDocument(uri);
        activeSwing_1.refreshTreeView();
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(`${constants_1.EXTENSION_NAME}.uploadSwingFile`, async (node) => {
        const files = await vscode_1.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: true,
            openLabel: "Upload",
        });
        if (!files) {
            return;
        }
        await Promise.all(files.map(async (file) => {
            const contents = await vscode_1.workspace.fs.readFile(file);
            const fileName = path.basename(file.path);
            const filePath = node ? `${node.directory}/${fileName}` : fileName;
            const uri = vscode_1.Uri.joinPath(store_1.store.activeSwing.rootUri, filePath);
            await vscode_1.workspace.fs.writeFile(uri, contents);
        }));
        activeSwing_1.refreshTreeView();
        // We're assuming the uploaded file impacts
        // the rendering of the swing.
        store_1.store.activeSwing.webView.rebuildWebview();
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(`${constants_1.EXTENSION_NAME}.renameSwingFile`, async (node) => {
        const file = await vscode_1.window.showInputBox({
            placeHolder: "Enter the name you'd like to rename this file to",
            value: node.file,
        });
        if (!file) {
            return;
        }
        const newUri = vscode_1.Uri.joinPath(store_1.store.activeSwing.rootUri, file);
        await utils_1.withProgress("Renaming file...", async () => {
            // If the file being renamed is dirty, then we
            // need to save it before renaming it. Otherwise,
            // VS Code will retain the old file and show it as
            // deleted, since they don't want to lose the changing.
            const visibleDocument = vscode_1.window.visibleTextEditors.find((editor) => editor.document.uri.toString() === node.resourceUri.toString());
            if (visibleDocument) {
                await visibleDocument.document.save();
            }
            await vscode_1.workspace.fs.rename(node.resourceUri, newUri);
        });
        activeSwing_1.refreshTreeView();
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(`${constants_1.EXTENSION_NAME}.deleteSwingFile`, async (node) => {
        const message = `Are you sure you want to delete the "${node.file}" file?`;
        if (await vscode_1.window.showInformationMessage(message, "Delete")) {
            await vscode_1.workspace.fs.delete(node.resourceUri);
            activeSwing_1.refreshTreeView();
        }
    }));
}
exports.registerTreeViewCommands = registerTreeViewCommands;
//# sourceMappingURL=commands.js.map