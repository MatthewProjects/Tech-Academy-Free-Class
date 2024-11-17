"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const PreviewManager_1 = require("./PreviewManager");
const Constants = require("./Constants");
class Utilities {
    //returns true if an html document is open
    static checkDocumentIsHTML(showWarning) {
        const languageId = vscode.window.activeTextEditor.document.languageId.toLowerCase();
        let result = (languageId === "html" || languageId === "xhtml");
        if (!result && showWarning) {
            vscode.window.showInformationMessage(Constants.ErrorMessages.NO_HTML);
        }
        return result;
    }
    static checkDocumentIs(languageId) {
        return vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId.toLowerCase() === languageId;
    }
    static init(viewColumn, context, previewUri) {
        let proceed = this.checkDocumentIsHTML(true);
        if (proceed) {
            if (!Utilities.panel) {
                Utilities.panel = vscode.window.createWebviewPanel('quickHTMLPreview', 'Preview', viewColumn, {
                    enableScripts: true
                });
                Utilities.panel.onDidDispose(() => {
                    Utilities.panel = null;
                });
            }
            Utilities.refreshContent();
        }
    }
    static refreshContent() {
        Utilities.panel.webview.html = PreviewManager_1.PreviewManager.htmlDocumentContentProvider.generateHTML();
    }
}
exports.default = Utilities;
//# sourceMappingURL=Utilities.js.map