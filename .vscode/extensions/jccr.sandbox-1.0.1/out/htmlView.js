"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const jsdom_1 = require("jsdom");
const getAttributes_1 = require("./getAttributes");
const buildInitScript = (htmlAttributes, styleId) => `
  const htmlAttrs = ${JSON.stringify(htmlAttributes)};
  for (const [attr, value] of Object.entries(htmlAttrs)) {
    document.documentElement.setAttribute(attr, value);
  }
  document.getElementById('_defaultStyles').remove();
  setTimeout(() => {
    document.documentElement.style = '';
    if (htmlAttrs['style']) {
      document.documentElement.style = htmlAttrs['style'];
    }
  }, 0);

  const vscode = acquireVsCodeApi();
  const style = document.getElementById('${styleId}');
  const state = vscode.getState();

  if (state && state.css) {
    style.textContent = state.css;
  }

  window.addEventListener('message', event => {
    const message = event.data;

    if (message.command === 'setCSS') {
      const css = message.value;
      vscode.setState({ css });
      style.textContent = css;
    }
  });

  window.alert = (message) => {
    vscode.postMessage({
      command: 'alert',
      text: message
    })
  }
`;
class HTMLView {
    constructor(webview, context) {
        this._html = "";
        this._css = "";
        this._js = "";
        this.webview = webview;
        webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case "alert":
                    if (!message.text) {
                        return;
                    }
                    vscode.window.showWarningMessage(message.text);
                    break;
            }
        }, undefined, context.subscriptions);
        this._id = Math.random()
            .toString(36)
            .substr(2, 9);
        this.buildHTML();
    }
    set html(html) {
        this._html = html;
        this.buildHTML();
    }
    set css(css) {
        this._css = css;
        this.webview.postMessage({ command: "setCSS", value: css });
    }
    set js(js) {
        this._js = js;
        this.buildHTML();
    }
    buildHTML() {
        const dom = new jsdom_1.JSDOM(this._html);
        const { document } = dom.window;
        const styleId = `sandbox-style-${this._id}`;
        const init = document.createElement("script");
        init.textContent = buildInitScript(getAttributes_1.getAttributes(document.documentElement), styleId);
        document.head.prepend(init);
        const style = document.createElement("style");
        style.textContent = this._css;
        style.id = styleId;
        document.head.prepend(style);
        const defaultStyle = document.createElement("style");
        defaultStyle.textContent = "body{background-color:white;}";
        document.head.prepend(defaultStyle);
        const script = document.createElement("script");
        script.textContent = this._js + "\n//# sourceURL=script.js";
        script.id = `sandbox-script-${this._id}`;
        document.body.append(script);
        this.webview.html = dom.serialize();
    }
}
exports.HTMLView = HTMLView;
//# sourceMappingURL=htmlView.js.map