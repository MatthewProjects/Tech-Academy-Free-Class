'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssCompletionItemProvider = void 0;
const vscode = require("vscode");
const cssAggregator_1 = require("./cssAggregator");
class CssCompletionItemProvider {
    constructor() {
        this.refreshCompletionItems();
    }
    provideCompletionItems(document, position, token) {
        if (canTriggerCompletion(document, position)) {
            return this.completionItems;
        }
        else {
            return Promise.reject('Not inside html class attribute.');
        }
    }
    refreshCompletionItems() {
        this.completionItems = (0, cssAggregator_1.default)().then((cssClasses) => {
            const completionItems = cssClasses.map((cssClass) => {
                const completionItem = new vscode.CompletionItem(cssClass);
                completionItem.detail = `Insert ${cssClass}`;
                completionItem.insertText = cssClass;
                completionItem.kind = vscode.CompletionItemKind.Value;
                // make sure our completion item group are first
                completionItem.preselect = true;
                return completionItem;
            });
            return completionItems;
        });
    }
}
exports.CssCompletionItemProvider = CssCompletionItemProvider;
function canTriggerCompletion(document, position) {
    const attributeName = [
        'typescriptreact',
        'javascriptreact',
    ].includes(document.languageId)
        ? 'className'
        : 'class';
    const lineUntilCursorPosition = getLineUntilPosition(document, position);
    const textAfterAttributeStart = getTextAfterAttributeStart(lineUntilCursorPosition, attributeName);
    const attributeClosed = isAttributeClosed(textAfterAttributeStart, attributeName);
    return textAfterAttributeStart.length > 1 && attributeClosed;
}
// helper functions
function getLineUntilPosition(document, position) {
    return document.getText(new vscode.Range(position.with(undefined, 0), position));
}
function getTextAfterAttributeStart(lineUntilPosition, attributeName) {
    const lastAttributeOccurrence = lineUntilPosition.lastIndexOf(attributeName);
    return lineUntilPosition.substr(lastAttributeOccurrence);
}
function isAttributeClosed(text, attributeName) {
    const attributeRegex = new RegExp(`${attributeName}=(?:\"[a-zA-Z0-9-\\s]*\"|\'[a-zA-Z0-9-\\s]*\'|.*[=>])`);
    return text.search(attributeRegex) === -1;
}
//# sourceMappingURL=cssCompletionItemProvider.js.map