"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileScriptContent = exports.getScriptContent = exports.includesReactScripts = exports.includesReactFiles = exports.REACT_SCRIPTS = exports.isReactFile = exports.SCRIPT_EXTENSIONS = exports.REACT_EXTENSIONS = exports.ScriptLanguage = exports.SCRIPT_BASE_NAME = void 0;
const path = require("path");
const skypack_1 = require("../libraries/skypack");
exports.SCRIPT_BASE_NAME = "script";
exports.ScriptLanguage = {
    babel: ".babel",
    javascript: ".js",
    javascriptmodule: ".mjs",
    javascriptreact: ".jsx",
    typescript: ".ts",
    typescriptreact: ".tsx",
};
exports.REACT_EXTENSIONS = [
    exports.ScriptLanguage.babel,
    exports.ScriptLanguage.javascriptreact,
    exports.ScriptLanguage.typescriptreact,
];
const MODULE_EXTENSIONS = [exports.ScriptLanguage.javascriptmodule];
const TYPESCRIPT_EXTENSIONS = [exports.ScriptLanguage.typescript, ...exports.REACT_EXTENSIONS];
exports.SCRIPT_EXTENSIONS = [
    exports.ScriptLanguage.javascript,
    ...MODULE_EXTENSIONS,
    ...TYPESCRIPT_EXTENSIONS,
];
function isReactFile(fileName) {
    return exports.REACT_EXTENSIONS.includes(path.extname(fileName));
}
exports.isReactFile = isReactFile;
exports.REACT_SCRIPTS = ["react", "react-dom"];
function includesReactFiles(files) {
    return files.some(isReactFile);
}
exports.includesReactFiles = includesReactFiles;
function includesReactScripts(scripts) {
    return exports.REACT_SCRIPTS.every((script) => scripts.includes(script));
}
exports.includesReactScripts = includesReactScripts;
function getScriptContent(document, manifest) {
    const extension = path.extname(document.uri.path).toLocaleLowerCase();
    let isModule = MODULE_EXTENSIONS.includes(extension);
    const content = document.getText();
    if (content.trim() === "") {
        return [content, isModule];
    }
    else if ((manifest === null || manifest === void 0 ? void 0 : manifest.scriptType) === 'module') {
        isModule = true;
    }
    else {
        isModule = isModule || content.trim().startsWith("import ");
    }
    const includesJsx = manifest && manifest.scripts && manifest.scripts.includes("react");
    const compileComponent = compileScriptContent(content, extension, isModule, includesJsx);
    return compileComponent ? [compileComponent, isModule] : null;
}
exports.getScriptContent = getScriptContent;
function compileScriptContent(content, extension, isModule = true, includesJsx = true) {
    if (isModule) {
        if (includesJsx) {
            // React can only be imported into the page once, and so if the user's
            // code is trying to import it, we need to replace that import statement.
            content = content
                .replace(/import (?:\* as )?React from (["'])react\1/, "")
                .replace(/import (.+) from (["'])react\2/, "const $1 = React")
                .replace(/from (["'])react-native\1/, "from $1https://gistcdn.githack.com/lostintangent/6de9be49a0f112dd36eff3b8bc771b9e/raw/ce12b9075322245be20a79eba4d89d4e5152a4aa/index.js$1");
        }
        content = skypack_1.processImports(content);
    }
    if (TYPESCRIPT_EXTENSIONS.includes(extension) || includesJsx) {
        const typescript = require("typescript");
        const compilerOptions = {
            experimentalDecorators: true,
            target: "ES2018",
        };
        if (includesJsx || exports.REACT_EXTENSIONS.includes(extension)) {
            compilerOptions.jsx = typescript.JsxEmit.React;
        }
        try {
            return typescript.transpile(content, compilerOptions);
        }
        catch (e) {
            // Something failed when trying to transpile Pug,
            // so don't attempt to return anything
            return null;
        }
    }
    else {
        return content;
    }
}
exports.compileScriptContent = compileScriptContent;
//# sourceMappingURL=script.js.map