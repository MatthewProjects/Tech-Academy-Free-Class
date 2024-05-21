"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyWatch = exports.getActiveWatches = exports.watchProject = exports.compileProject = exports.getCssFileName = exports.compileSassText = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const sass_1 = require("sass");
const vscode_1 = require("vscode");
const util_1 = require("./util");
function compileSassText(text, isIndentedSyntax) {
    try {
        return sass_1.renderSync({
            data: text,
            file: "module.scss",
            outFile: "module.css",
            indentWidth: 4,
            sourceMap: true,
            omitSourceMapUrl: true,
            indentedSyntax: isIndentedSyntax,
        });
    }
    catch (e) {
        return e;
    }
}
exports.compileSassText = compileSassText;
function getCssFileName(file) {
    let pos = file.lastIndexOf(".");
    return file.substr(0, pos < 0 ? file.length : pos) + ".css";
}
exports.getCssFileName = getCssFileName;
function compileAndSaveFile(root, file, config, saveError = false) {
    const isIndentedSyntax = file.endsWith(".sass");
    let outFile = getCssFileName(file);
    if (config.outDir) {
        if (path_1.isAbsolute(config.outDir))
            outFile = path_1.join(config.outDir, path_1.relative(root, outFile));
        else
            outFile = path_1.join(root, config.outDir, path_1.relative(root, outFile));
    }
    const outFolder = path_1.dirname(outFile);
    if (!fs_1.existsSync(outFolder))
        fs_1.mkdirSync(outFolder, { recursive: true });
    try {
        const compiledCode = sass_1.renderSync({
            file: file,
            outFile: outFile,
            indentType: config.indentType,
            indentWidth: config.indentWidth,
            indentedSyntax: isIndentedSyntax,
            linefeed: config.linefeed,
            omitSourceMapUrl: config.omitSourceMapUrl,
            outputStyle: config.outputStyle,
            sourceMap: config.sourceMaps,
        });
        fs_1.writeFileSync(outFile, compiledCode.css, { encoding: "utf8" });
        if (config.sourceMaps) {
            fs_1.writeFileSync(`${outFile}.map`, compiledCode.map, { encoding: "utf8" });
        }
    }
    catch (error) {
        if (!saveError)
            throw error;
        fs_1.writeFileSync(outFile, error.message);
    }
}
async function compileProject(files, config, root) {
    const _this = compileProject;
    if (typeof _this.outputChannel === "undefined") {
        _this.outputChannel = vscode_1.window.createOutputChannel(`Sass Compile Errors`);
    }
    files = files.filter((file) => !path_1.basename(file).startsWith("_"));
    const promises = [];
    files.forEach((file) => {
        promises.push((async function () {
            try {
                compileAndSaveFile(root, file, config);
                return Promise.resolve();
            }
            catch (error) {
                _this.outputChannel.appendLine(error.message);
                _this.outputChannel.show();
                return Promise.resolve();
            }
        })());
    });
    await Promise.all(promises);
}
exports.compileProject = compileProject;
const watches = {};
async function watchProject(configPath, config) {
    if (Object.keys(watches).includes(configPath))
        return;
    const root = path_1.dirname(configPath);
    (await vscode_1.workspace.findFiles(path_1.join(path_1.relative(vscode_1.workspace.workspaceFolders[0].uri.fsPath, root), "**/*.{sass,scss}")))
        .map((uri) => uri.fsPath)
        .filter((file) => !path_1.basename(file).startsWith("_"))
        .forEach((file) => {
        compileAndSaveFile(root, file, config, true);
    });
    watches[configPath] = vscode_1.workspace.onDidSaveTextDocument((document) => {
        const file = document.fileName;
        if (!util_1.isSubDirOf(file, root) || !util_1.isSassFile(file) || path_1.basename(file).endsWith("_"))
            return;
        compileAndSaveFile(root, file, config, true);
    });
}
exports.watchProject = watchProject;
function getActiveWatches() {
    return Object.keys(watches);
}
exports.getActiveWatches = getActiveWatches;
function destroyWatch(watchConfigPath) {
    if (!Object.keys(watches).includes(watchConfigPath))
        return;
    watches[watchConfigPath].dispose();
    delete watches[watchConfigPath];
}
exports.destroyWatch = destroyWatch;
//# sourceMappingURL=sassHelper.js.map