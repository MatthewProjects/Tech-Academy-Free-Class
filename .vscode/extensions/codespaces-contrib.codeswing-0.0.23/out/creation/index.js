"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCreationModule = exports.newSwing = void 0;
const openai_1 = require("openai");
const vscode = require("vscode");
const config = require("../config");
const constants_1 = require("../constants");
const preview_1 = require("../preview");
const store_1 = require("../store");
const utils_1 = require("../utils");
const galleryProvider_1 = require("./galleryProvider");
const storage_1 = require("./storage");
async function createSwingDirectory() {
    const dayjs = require("dayjs");
    const timestamp = dayjs().format("YYYY-MM-DD (hh-mm-ss A)");
    const rootDirectory = config.get("rootDirectory");
    const rootUri = rootDirectory
        ? vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, rootDirectory)
        : store_1.store.globalStorageUri;
    const swingDirectory = vscode.Uri.joinPath(rootUri, timestamp);
    await vscode.workspace.fs.createDirectory(swingDirectory);
    return swingDirectory;
}
async function getTemplates() {
    const galleries = await galleryProvider_1.loadGalleries();
    const templates = galleries
        .filter((gallery) => gallery.enabled)
        .flatMap((gallery) => gallery.templates)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((t) => ({ ...t, label: t.title }));
    return templates;
}
async function newSwing(uri, title = "Create new swing") {
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = title;
    quickPick.placeholder = "Select the template to use";
    quickPick.matchOnDescription = true;
    quickPick.ignoreFocusOut = true;
    const templates = await getTemplates();
    if (templates.length === 0) {
        templates.push({
            label: "No templates available. Configure your template galleries and try again.",
        });
    }
    const mru = storage_1.storage.getTemplateMRU();
    if (mru && mru.length > 0) {
        for (let i = mru.length - 1; i >= 0; i--) {
            const itemIndex = templates.findIndex((gallery) => gallery.label === mru[i]);
            if (itemIndex !== -1) {
                const [item] = templates.splice(itemIndex, 1);
                item.alwaysShow = true;
                item.description = "Recently used";
                templates.unshift(item);
            }
        }
    }
    const aiTooltip = "Generate template with AI";
    quickPick.items = templates;
    quickPick.buttons = [
        {
            iconPath: new vscode.ThemeIcon("settings"),
            tooltip: "Configure Template Galleries",
        },
        {
            iconPath: new vscode.ThemeIcon("sparkle"),
            tooltip: aiTooltip,
        },
    ];
    quickPick.onDidTriggerButton((e) => {
        if (e.tooltip === aiTooltip) {
            synthesizeTemplate(uri);
        }
        else {
            promptForGalleryConfiguration(uri, title);
        }
    });
    quickPick.onDidAccept(async () => {
        quickPick.hide();
        const template = quickPick.selectedItems[0];
        if (template.files) {
            await utils_1.withProgress("Creating swing...", async () => newSwingFromTemplate(template.files, uri));
            await storage_1.storage.addTemplateToMRU(template.label);
        }
    });
    quickPick.show();
}
exports.newSwing = newSwing;
const preamble = `You are a web coding playground, and allow users to generate runnable code snippets, using a combination of HTML, JavaScript, and CSS. You can also load JavaScript/NPM libraries from https://unpkg.com by simply importing them as a module in the generated JavaScript file.

When you’re fulfilling a request for a playground, you should separate out the HTML, JavaScript, and CSS code into separate files called: index.html, script.js, and styles.css. If the user’s request doesn’t require one of these files, then you can simply omit it.

Here are some examples of how to format your response.

REQUEST:
Simple hello world app, with red text, and a pop up message that says hi to the user

RESPONSE:
<<—[index.html]
<div>Hello world</div>
—>>

<<—[script.js]
alert(“hi”);
—>>

<<—[styles.css]
body {
   color: red;
}
—>>

With that sample in mind, let’s generate some code for the user.

REQUEST:
{{REQUEST}}

RESPONSE:`;
async function synthesizeTemplate(uri) {
    const prompt = await vscode.window.showInputBox({
        placeHolder: "Describe the swing you want to generate",
    });
    if (!prompt)
        return;
    await utils_1.withProgress("Creating swing...", async () => {
        const configuration = new openai_1.Configuration({
            apiKey: "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",
        });
        const openai = new openai_1.OpenAIApi(configuration);
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: preamble.replace("{{REQUEST}}", prompt) },
            ],
        });
        const response = chatCompletion.data.choices[0].message;
        const files = response === null || response === void 0 ? void 0 : response.content.trimEnd().split("—>>").filter((e) => e !== "").map((e) => {
            e = e.trim();
            const p = e.split("]\n");
            return { filename: p[0].replace("<<—[", ""), content: p[1] };
        });
        newSwingFromTemplate(files, uri);
    });
}
async function newSwingFromTemplate(files, uri) {
    const manifest = files.find((file) => file.filename === constants_1.SWING_FILE);
    if (!manifest) {
        const content = JSON.stringify(preview_1.DEFAULT_MANIFEST, null, 2);
        files.push({ filename: constants_1.SWING_FILE, content });
    }
    else if (manifest.content) {
        try {
            const content = JSON.parse(manifest.content);
            delete content.template;
            manifest.content = JSON.stringify(content, null, 2);
        }
        catch {
            // If the template included an invalid
            // manifest file, then there's nothing
            // we can really do about it.
        }
    }
    let swingUri;
    if (uri instanceof Function) {
        swingUri = await uri(files.map(({ filename, content }) => ({
            filename,
            content: content ? content : "",
        })));
    }
    else {
        await Promise.all(files.map(({ filename, content = "" }) => {
            const targetFileUri = vscode.Uri.joinPath(uri, filename);
            return vscode.workspace.fs.writeFile(targetFileUri, utils_1.stringToByteArray(content));
        }));
        swingUri = uri;
    }
    preview_1.openSwing(swingUri);
}
async function promptForGalleryConfiguration(uri, title) {
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = "Configure template galleries";
    quickPick.placeholder =
        "Select the galleries you'd like to display templates from";
    quickPick.canSelectMany = true;
    const galleries = (await galleryProvider_1.loadGalleries())
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((gallery) => ({ ...gallery, label: gallery.title }));
    quickPick.items = galleries;
    quickPick.selectedItems = galleries.filter((gallery) => gallery.enabled);
    quickPick.buttons = [vscode.QuickInputButtons.Back];
    quickPick.onDidTriggerButton((e) => {
        if (e === vscode.QuickInputButtons.Back) {
            return newSwing(uri, title);
        }
    });
    quickPick.onDidAccept(async () => {
        const galleries = quickPick.selectedItems.map((item) => item.id);
        quickPick.busy = true;
        await galleryProvider_1.enableGalleries(galleries);
        quickPick.busy = false;
        quickPick.hide();
        return newSwing(uri, title);
    });
    quickPick.show();
}
function registerCreationModule(context, api, syncKeys) {
    context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.EXTENSION_NAME}.newSwing`, async () => {
        const uri = await createSwingDirectory();
        newSwing(uri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.EXTENSION_NAME}.newSwingFromLastTemplate`, async () => {
        const [latestTemplate] = storage_1.storage.getTemplateMRU();
        const templates = await getTemplates();
        const template = templates.find((template) => template.label === latestTemplate);
        if (template) {
            const uri = await createSwingDirectory();
            newSwingFromTemplate(template.files, uri);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.EXTENSION_NAME}.newSwingDirectory`, async () => {
        var _a;
        const folder = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            defaultUri: (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0].uri,
        });
        if (folder) {
            newSwing(folder[0]);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.EXTENSION_NAME}.initializeWorkspace`, async () => {
        const uri = vscode.workspace.workspaceFolders[0].uri;
        newSwing(uri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.EXTENSION_NAME}.saveCurrentSwing`, async () => {
        var _a;
        const folder = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            defaultUri: (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0].uri,
        });
        if (!folder) {
            return;
        }
        await utils_1.withProgress("Saving swing...", async () => {
            const files = await vscode.workspace.fs.readDirectory(store_1.store.activeSwing.rootUri);
            return Promise.all(files.map(async ([file]) => {
                const sourceUri = vscode.Uri.joinPath(store_1.store.activeSwing.rootUri, file);
                const contents = await vscode.workspace.fs.readFile(sourceUri);
                const uri = vscode.Uri.joinPath(folder[0], file);
                await vscode.workspace.fs.writeFile(uri, contents);
            }));
        });
    }));
    storage_1.initializeStorage(context, syncKeys);
    api.newSwing = newSwing;
    api.registerTemplateProvider = galleryProvider_1.registerTemplateProvider;
}
exports.registerCreationModule = registerCreationModule;
//# sourceMappingURL=index.js.map