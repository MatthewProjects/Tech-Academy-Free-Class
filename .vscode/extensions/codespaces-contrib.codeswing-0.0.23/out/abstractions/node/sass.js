"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const sass = require("sass");
async function compile(content, indentedSyntax, importUri) {
    const { css } = sass.renderSync({
        data: content,
        indentedSyntax,
        includePaths: [importUri.path],
    });
    return css;
}
exports.compile = compile;
//# sourceMappingURL=sass.js.map