"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLibraryVersions = exports.getCdnJsLibraries = void 0;
const axios_1 = require("axios");
const LIBRARIES_URL = "https://api.cdnjs.com/libraries";
let libraries;
async function getLibrariesInternal() {
    try {
        const response = await axios_1.default.get(`${LIBRARIES_URL}?fields=description`);
        libraries = response.data.results;
        return libraries;
    }
    catch {
        throw new Error("Cannot get the libraries.");
    }
}
let currentGetLibrariesPromise;
async function getCdnJsLibraries() {
    if (libraries) {
        return libraries;
    }
    if (currentGetLibrariesPromise) {
        return await currentGetLibrariesPromise;
    }
    currentGetLibrariesPromise = getLibrariesInternal();
    return await currentGetLibrariesPromise;
}
exports.getCdnJsLibraries = getCdnJsLibraries;
async function getLibraryVersions(libraryName) {
    try {
        const { data: { assets }, } = await axios_1.default.get(`${LIBRARIES_URL}/${libraryName}?fields=assets`);
        // The CDNJS API returns the versions
        // in ascending order, so we want to reverse it.
        return assets.reverse();
    }
    catch {
        return [];
    }
}
exports.getLibraryVersions = getLibraryVersions;
//# sourceMappingURL=cdnjs.js.map