'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const HTMLDocumentContentProvider_1 = require("./HTMLDocumentContentProvider");
const Utilities_1 = require("./Utilities");
// This class initializes the previewmanager based on extension type and manages all the subscriptions
class PreviewManager {
    constructor() {
        this.delayTime = 100;
        this.htmlDocumentContentProvider = new HTMLDocumentContentProvider_1.default();
        vscode.workspace.onDidChangeTextDocument(this.onChangeTextContent, this);
        vscode.window.onDidChangeActiveTextEditor(this.onChangeActiveEditor, this);
    }
    onChangeTextContent(e) {
        if (Utilities_1.default.checkDocumentIs('javascript')) {
            this.debounce(this.refreshJavascriptContent, this.delayTime)(e);
        }
        else if (Utilities_1.default.checkDocumentIs('css')) {
            this.debounce(this.refreshCssContent, this.delayTime)(e);
        }
        else if (Utilities_1.default.checkDocumentIs('html') || Utilities_1.default.checkDocumentIs('xhtml')) {
            this.debounce(this.refreshHMTLContent, this.delayTime)(e);
        }
    }
    debounce(fun, delay) {
        return (args) => {
            clearTimeout(fun.id);
            fun.id = setTimeout(() => {
                fun.call(this, args);
            }, delay);
        };
    }
    refreshJavascriptContent(e) {
        this.updateLinkData(e);
        Utilities_1.default.refreshContent();
    }
    refreshCssContent(e) {
        this.updateLinkData(e);
        Utilities_1.default.refreshContent();
    }
    refreshHMTLContent() {
        Utilities_1.default.refreshContent();
    }
    updateLinkData(e) {
        let editorData = {
            key: e.document.fileName,
            value: e.document.getText()
        };
        this.htmlDocumentContentProvider.setChangedLinks(editorData);
    }
    onChangeActiveEditor(e) {
        if ((Utilities_1.default.checkDocumentIs('html') || Utilities_1.default.checkDocumentIs('xhtml')) && this.htmlDocumentContentProvider.getTextEditor() != e) {
            this.htmlDocumentContentProvider.setTextEditor(e);
            Utilities_1.default.refreshContent();
        }
    }
}
let _instance = new PreviewManager();
exports.PreviewManager = _instance;
//# sourceMappingURL=PreviewManager.js.map