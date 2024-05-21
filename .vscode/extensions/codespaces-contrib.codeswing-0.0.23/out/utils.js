"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withProgress = exports.getUriContents = exports.getFileContents = exports.checkForSwingWorkspace = exports.stringToByteArray = exports.byteArrayToString = void 0;
const vscode_1 = require("vscode");
const config = require("./config");
const constants_1 = require("./constants");
const preview_1 = require("./preview");
function byteArrayToString(value) {
    return new TextDecoder().decode(value);
}
exports.byteArrayToString = byteArrayToString;
function stringToByteArray(value) {
    return new TextEncoder().encode(value);
}
exports.stringToByteArray = stringToByteArray;
async function checkForSwingWorkspace() {
    switch (config.get("launchBehavior")) {
        case "openSwing": {
            if (vscode_1.workspace.workspaceFolders) {
                const files = await vscode_1.workspace.findFiles(constants_1.SWING_FILE);
                if (files.length > 0) {
                    preview_1.openSwing(vscode_1.workspace.workspaceFolders[0].uri);
                }
                else if (config.get("rootDirectory")) {
                    vscode_1.commands.executeCommand(`${constants_1.EXTENSION_NAME}.initializeWorkspace`);
                }
            }
            break;
        }
        case "newSwing": {
            vscode_1.commands.executeCommand(`${constants_1.EXTENSION_NAME}.newSwing`);
            break;
        }
    }
}
exports.checkForSwingWorkspace = checkForSwingWorkspace;
async function getFileContents(swingUri, file) {
    const uri = vscode_1.Uri.joinPath(swingUri, file);
    return getUriContents(uri);
}
exports.getFileContents = getFileContents;
async function getUriContents(uri) {
    const contents = await vscode_1.workspace.fs.readFile(uri);
    return byteArrayToString(contents);
}
exports.getUriContents = getUriContents;
function withProgress(title, action) {
    return vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title,
    }, action);
}
exports.withProgress = withProgress;
//# sourceMappingURL=utils.js.map