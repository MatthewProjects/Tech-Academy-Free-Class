'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Constants = require("./Constants");
const Utilities_1 = require("./Utilities");
const StatusBarItem_1 = require("./StatusBarItem");
const opn = require('opn');
function activate(context) {
    let statusBarItem = new StatusBarItem_1.default();
    statusBarItem.updateStatusbar();
    // Subscribe so that the statusBarItem gets updated
    let disposableStatusBar = vscode.window.onDidChangeActiveTextEditor(statusBarItem.updateStatusbar, statusBarItem, context.subscriptions);
    let previewUri = vscode.Uri.parse(Constants.ExtensionConstants.PREVIEW_URI);
    // Register the commands that are provided to the user
    let disposableSidePreview = vscode.commands.registerCommand('extension.sidePreview', () => {
        Utilities_1.default.init(vscode.ViewColumn.Two, context, previewUri);
    });
    let disposableStandalonePreview = vscode.commands.registerCommand('extension.fullPreview', () => {
        Utilities_1.default.init(vscode.ViewColumn.One, context, previewUri);
    });
    let disposableInBrowser = vscode.commands.registerCommand("extension.inBrowser", () => {
        if (Utilities_1.default.checkDocumentIsHTML(true)) {
            opn(vscode.window.activeTextEditor.document.fileName);
        }
    });
    // push to subscriptions list so that they are disposed automatically
    context.subscriptions.push(disposableSidePreview);
    context.subscriptions.push(disposableStandalonePreview);
    context.subscriptions.push(disposableInBrowser);
}
exports.activate = activate;
// This method is called when extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map