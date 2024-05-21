"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProxyFileSystemProvider = exports.ProxyFileSystemProvider = void 0;
const path = require("path");
const vscode = require("vscode");
const utils_1 = require("../utils");
const svelte_1 = require("./languages/components/svelte");
const script_1 = require("./languages/script");
const skypack_1 = require("./libraries/skypack");
class ProxyFileSystemProvider {
    constructor() {
        this._emitter = new vscode.EventEmitter();
        this.onDidChangeFile = this
            ._emitter.event;
    }
    stat(uri) {
        return {
            type: vscode.FileType.File,
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
        };
    }
    async readFile(uri) {
        let proxyUri = vscode.Uri.parse(decodeURIComponent(uri.path.substr(1)));
        const extension = path.extname(uri.path);
        if (extension === ".js") {
            let type;
            if (uri.query) {
                const query = new URLSearchParams(uri.query);
                type = query.get("type");
                proxyUri = proxyUri.with({
                    path: proxyUri.path.replace(".js", `.${type}`),
                    query: "",
                });
            }
            let contents = utils_1.byteArrayToString(await vscode.workspace.fs.readFile(proxyUri));
            if (type === "svelte") {
                [contents] = await svelte_1.compileComponent(contents);
            }
            else if (type === "jsx" || type === "tsx") {
                const compiledContent = await script_1.compileScriptContent(contents, `.${type}`);
                if (compiledContent) {
                    contents = compiledContent;
                }
            }
            else if (type === "json") {
                contents = `export default ${contents}`;
            }
            else if (type === "css") {
                contents = `const styleElement = document.createElement("style");
styleElement.innerText = \`${contents}\`;
document.head.appendChild(styleElement);`;
            }
            return utils_1.stringToByteArray(skypack_1.processImports(contents));
        }
        else {
            return vscode.workspace.fs.readFile(proxyUri);
        }
    }
    static getProxyUri(uri) {
        return vscode.Uri.parse(`${ProxyFileSystemProvider.SCHEME}:/${encodeURIComponent(uri.toString())}`);
    }
    writeFile(uri, content, options) {
        throw vscode.FileSystemError.NoPermissions("Not supported");
    }
    delete(uri) {
        throw vscode.FileSystemError.NoPermissions("Not supported");
    }
    readDirectory(uri) {
        throw vscode.FileSystemError.NoPermissions("Not supported");
    }
    rename(oldUri, newUri, options) {
        throw vscode.FileSystemError.NoPermissions("Not supported");
    }
    createDirectory(uri) {
        throw vscode.FileSystemError.NoPermissions("Not supported");
    }
    watch(_resource) {
        throw vscode.FileSystemError.NoPermissions("Not supported");
    }
}
exports.ProxyFileSystemProvider = ProxyFileSystemProvider;
ProxyFileSystemProvider.SCHEME = "codeswing-proxy";
function registerProxyFileSystemProvider() {
    vscode.workspace.registerFileSystemProvider(ProxyFileSystemProvider.SCHEME, new ProxyFileSystemProvider(), {
        isReadonly: true,
    });
}
exports.registerProxyFileSystemProvider = registerProxyFileSystemProvider;
//# sourceMappingURL=proxyFileSystemProvider.js.map