"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const Constants = require("./Constants");
const cheerio = require('cheerio');
const PREFIX_LINK = 'qp';
const ATTRS = ['src', 'href'];
/**
 * HTMLDocumentContentProvider
 */
class HTMLDocumentContentProvider {
    constructor() {
        this._changedLinks = new Map();
        this._textEditor = vscode.window.activeTextEditor;
    }
    provideTextDocumentContent(uri) {
        return this.generateHTML();
    }
    ;
    generateHTML() {
        let plainText = this._textEditor.document.getText();
        let html = this.fixLinks(plainText);
        // translate url in style tag
        html = this.replaceUrlToVscodeResource(html, this._textEditor.document.fileName);
        let changedHtmlContent = this.addChangedLinkContent(html);
        let htmlWithStyle = this.addStyles(changedHtmlContent);
        return htmlWithStyle;
    }
    // Thanks to Thomas Haakon Townsend for coming up with this regex
    fixLinks(html) {
        let htmlFilePath = this._textEditor.document.fileName;
        // return html;
        return html.replace(new RegExp(`((?:${ATTRS.join('|')})=[\'\"])((?!http|\\/).*?)([\'\"])`, "gmi"), (subString, p1, p2, p3) => {
            let fsPath = vscode.Uri.file(path.join(path.dirname(htmlFilePath), p2)).fsPath;
            let changedLinkPath = this._changedLinks.get(fsPath);
            if (changedLinkPath) {
                return [
                    `${PREFIX_LINK}-${p1}`,
                    fsPath,
                    p3
                ].join("");
            }
            else {
                return [
                    p1,
                    this.getVscodeResourcePath(p2, htmlFilePath),
                    p3
                ].join("");
            }
        });
    }
    addChangedLinkContent(content) {
        const $ = cheerio.load(content);
        ATTRS.forEach((value) => {
            let linkAttr = `${PREFIX_LINK}-${value}`;
            let $changedLink = $(`[${linkAttr}]`);
            if ($changedLink.length != 0) {
                let fsPath = $changedLink.attr(linkAttr);
                if ($changedLink[0].name === 'link') {
                    $changedLink.after(`
                        <style type="text/css">
                        ${this._changedLinks.get(fsPath)}
                        </style>`);
                }
                else {
                    $changedLink.html(this._changedLinks.get(fsPath));
                }
            }
        });
        return $.html();
    }
    setChangedLinks({ key, value }) {
        // translate image url as `url(./img/bg.png)`
        value = this.replaceUrlToVscodeResource(value, key);
        this._changedLinks.set(key, value);
    }
    clearChangedLinks() {
        this._changedLinks.clear();
    }
    getTextEditor() {
        return this._textEditor;
    }
    setTextEditor(te) {
        this._textEditor = te;
    }
    // Add styles to the current HTML so that it is displayed corectly in VS Code
    addStyles(html) {
        let extensionPath = vscode.extensions.getExtension(Constants.ExtensionConstants.EXTENSION_ID).extensionPath;
        let style_path = vscode.Uri.file(`${extensionPath}/${Constants.ExtensionConstants.CUSTOM_CSS_PATH}`);
        let styles = `<link href="${style_path.with({ scheme: 'vscode-resource' })}" rel="stylesheet" />`;
        return styles + html;
    }
    replaceUrlToVscodeResource(content, hostFilePath) {
        return content.replace(/url\((.*)\)/gmi, (subString, p1) => { return this.replaceUrlHandler(subString, p1, hostFilePath); });
    }
    replaceUrlHandler(subString, p1, hostFilePath) {
        if (p1.startsWith(`'`) && p1.endsWith(`'`) || p1.startsWith(`"`) && p1.endsWith(`"`)) {
            p1 = p1.substring(1, p1.length - 1);
        }
        if (p1.startsWith('http')) {
            return subString;
        }
        const vscodePath = this.getVscodeResourcePath(p1, hostFilePath);
        return subString.replace(p1, vscodePath);
    }
    getVscodeResourcePath(relativePath, hostFilePath) {
        return vscode.Uri.file(path.join(path.dirname(hostFilePath), relativePath)).with({ scheme: 'vscode-resource' }).toString();
    }
}
exports.default = HTMLDocumentContentProvider;
//# sourceMappingURL=HTMLDocumentContentProvider.js.map