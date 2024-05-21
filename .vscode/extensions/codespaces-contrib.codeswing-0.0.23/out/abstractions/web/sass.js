"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const vscode = require("vscode");
const Sass = require("sass.js");
async function compile(content, indentedSyntax, importUri) {
    Sass.importer(async (request, done) => {
        if (request.path) {
            done();
        }
        else if (request.current) {
            const fileExtension = indentedSyntax ? ".sass" : ".scss";
            if (!request.current.endsWith(fileExtension)) {
                request.current += fileExtension;
            }
            const uri = vscode.Uri.joinPath(importUri, request.current);
            const content = await vscode.workspace.fs.readFile(uri);
            done({
                content,
            });
        }
    });
    return new Promise((resolve) => {
        Sass.compile(content, { indentedSyntax }, (result) => resolve(result.text));
    });
}
exports.compile = compile;
//# sourceMappingURL=sass.js.map