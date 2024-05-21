"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSassFile = exports.isSubDirOf = exports.checkForSassConfig = exports.getThemeName = exports.getFileUri = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
function getFileUri(context, path) {
    return vscode_1.Uri.file(path_1.join(context.extensionPath, path));
}
exports.getFileUri = getFileUri;
function getThemeName() {
    switch (vscode_1.window.activeColorTheme.kind) {
        case vscode_1.ColorThemeKind.Dark:
            return "github-dark";
        case vscode_1.ColorThemeKind.Light:
            return "github";
        case vscode_1.ColorThemeKind.HighContrast:
            return "base16/windows-high-contrast";
    }
}
exports.getThemeName = getThemeName;
async function checkForSassConfig(statusBarItem) {
    const contains = (await vscode_1.workspace.findFiles("**/sassconfig.json")).length > 0;
    if (contains) {
        vscode_1.commands.executeCommand("setContext", "vscode-sassc.isSassProject", true);
        statusBarItem?.show();
    }
    else {
        vscode_1.commands.executeCommand("setContext", "vscode-sassc.isSassProject", false);
        statusBarItem?.hide();
    }
    return contains;
}
exports.checkForSassConfig = checkForSassConfig;
function isSubDirOf(path1, path2) {
    const path = path_1.relative(path2, path1);
    return !!path && !path.startsWith("..") && !path_1.isAbsolute(path);
}
exports.isSubDirOf = isSubDirOf;
function isSassFile(file) {
    return file.endsWith(".sass") || file.endsWith(".scss");
}
exports.isSassFile = isSassFile;
//# sourceMappingURL=util.js.map