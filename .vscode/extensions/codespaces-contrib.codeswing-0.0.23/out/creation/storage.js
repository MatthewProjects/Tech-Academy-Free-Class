"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeStorage = exports.storage = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const MRU_SIZE = 3;
const MRU_CONTEXT_KEY = `${constants_1.EXTENSION_NAME}:hasTemplateMRU`;
const MRU_STORAGE_KEY = `${constants_1.EXTENSION_NAME}:templateMRU`;
async function initializeStorage(context, syncKeys) {
    exports.storage = {
        getTemplateMRU() {
            const mru = context.globalState.get(MRU_STORAGE_KEY) || [];
            return mru.filter(template => template !== null);
        },
        async addTemplateToMRU(template) {
            const mru = this.getTemplateMRU();
            if (mru.includes(template)) {
                const oldIndex = mru.findIndex(item => item === template);
                mru.splice(oldIndex, 1);
            }
            mru.unshift(template);
            while (mru.length > MRU_SIZE) {
                mru.pop();
            }
            await context.globalState.update(MRU_STORAGE_KEY, mru);
            await vscode_1.commands.executeCommand("setContext", MRU_CONTEXT_KEY, true);
        },
    };
    if (exports.storage.getTemplateMRU().length > 0) {
        await vscode_1.commands.executeCommand("setContext", MRU_CONTEXT_KEY, true);
    }
    syncKeys.push(MRU_STORAGE_KEY);
}
exports.initializeStorage = initializeStorage;
//# sourceMappingURL=storage.js.map