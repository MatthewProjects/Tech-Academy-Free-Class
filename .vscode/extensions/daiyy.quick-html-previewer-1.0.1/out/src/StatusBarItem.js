"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Utilities_1 = require("./Utilities");
const Constants = require("./Constants");
class StatusBarItem {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarItem.command = "extension.sidePreview";
        this.statusBarItem.tooltip = Constants.ExtensionConstants.STATUS_BAR_TOOLTIP;
    }
    updateStatusbar() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.statusBarItem.hide();
            return;
        }
        // Only update status if an HTML file
        if (Utilities_1.default.checkDocumentIsHTML(false)) {
            this.statusBarItem.text = Constants.ExtensionConstants.STATUS_BAR_TEXT;
            this.statusBarItem.show();
        }
        else {
            this.statusBarItem.hide();
        }
    }
}
exports.default = StatusBarItem;
//# sourceMappingURL=StatusBarItem.js.map