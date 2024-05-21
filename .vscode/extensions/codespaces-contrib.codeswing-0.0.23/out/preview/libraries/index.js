"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSwingLibrary = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const __1 = require("..");
const constants_1 = require("../../constants");
const store_1 = require("../../store");
const utils_1 = require("../../utils");
const cdnjs_1 = require("./cdnjs");
async function libraryToVersionsPickList(libraryName) {
    const versions = await cdnjs_1.getLibraryVersions(libraryName);
    return versions.map((version) => ({
        label: version.version,
        version,
    }));
}
function libraryFilesToPickList(files) {
    return files.map((file) => ({
        label: file,
    }));
}
function createLibraryUrl(libraryName, libraryVersion, libraryFile) {
    return `https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${libraryVersion}/${libraryFile}`;
}
function getSwingManifest(text) {
    try {
        const json = JSON.parse(text);
        return {
            ...__1.DEFAULT_MANIFEST,
            ...json,
        };
    }
    catch {
        return __1.DEFAULT_MANIFEST;
    }
}
async function addDependencyLink(libraryType, libraryUrl) {
    const uri = vscode_1.Uri.joinPath(store_1.store.activeSwing.rootUri, constants_1.SWING_FILE);
    let manifest;
    try {
        const content = utils_1.byteArrayToString(await vscode.workspace.fs.readFile(uri));
        manifest = getSwingManifest(content);
    }
    catch (e) {
        manifest = __1.DEFAULT_MANIFEST;
    }
    manifest[libraryType].push(libraryUrl);
    manifest[libraryType] = [...new Set(manifest[libraryType])];
    const updatedContent = JSON.stringify(manifest, null, 2);
    vscode.workspace.fs.writeFile(uri, utils_1.stringToByteArray(updatedContent));
    store_1.store.activeSwing.webView.updateManifest(updatedContent, true);
}
const EXCLUDED_LABELS = ["cjs", "esm", ".min.", ".prod."];
const EXCLUDED_FILES = [".mjs", ".map"];
function filterVersionFiles({ files }) {
    return files.filter((file) => EXCLUDED_LABELS.every((label) => !file.includes(label)) &&
        EXCLUDED_FILES.every((excludedFile) => !file.endsWith(excludedFile)));
}
async function addSwingLibrary(libraryType) {
    const libraries = await cdnjs_1.getCdnJsLibraries();
    const libraryPickListItems = libraries.map((library) => {
        return {
            label: library.name,
            description: library.description,
            library,
        };
    });
    const list = vscode.window.createQuickPick();
    list.placeholder = "Select the library you'd like to add to the swing";
    list.items = libraryPickListItems;
    list.onDidChangeValue((value) => {
        list.items =
            value && value.match(constants_1.URI_PATTERN)
                ? [{ label: value }, ...libraryPickListItems]
                : libraryPickListItems;
    });
    const clipboardValue = await vscode.env.clipboard.readText();
    if (clipboardValue && clipboardValue.match(constants_1.URI_PATTERN)) {
        list.value = clipboardValue;
        list.items = [{ label: clipboardValue }, ...libraryPickListItems];
    }
    list.onDidAccept(async () => {
        const libraryAnswer = list.selectedItems[0] || list.value;
        list.hide();
        if (libraryAnswer.label.match(constants_1.URI_PATTERN)) {
            return await addDependencyLink(libraryType, libraryAnswer.label);
        }
        const libraryVersionAnswer = await vscode.window.showQuickPick(await libraryToVersionsPickList(libraryAnswer.label), {
            placeHolder: "Select the library version you'd like to use",
        });
        if (!libraryVersionAnswer) {
            return;
        }
        const libraryFiles = filterVersionFiles(libraryVersionAnswer.version);
        const fileAnswer = libraryFiles.length > 1
            ? await vscode.window.showQuickPick(await libraryFilesToPickList(libraryFiles), {
                placeHolder: "Select file version",
            })
            : { label: libraryFiles[0] };
        if (!fileAnswer) {
            return;
        }
        const libraryUrl = createLibraryUrl(libraryAnswer.library.name, libraryVersionAnswer.label, fileAnswer.label);
        await addDependencyLink(libraryType, libraryUrl);
    });
    list.show();
}
exports.addSwingLibrary = addSwingLibrary;
//# sourceMappingURL=index.js.map