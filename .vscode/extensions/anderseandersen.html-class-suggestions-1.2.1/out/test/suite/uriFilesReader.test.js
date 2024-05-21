"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uriFilesReader_1 = require("../../uriFilesReader");
const assert = require("assert");
const vscode_1 = require("vscode");
suite("Test uriFilesReader", () => {
    test("Can't load http protocol", () => {
        const httpsUri = vscode_1.Uri.parse("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
        return (0, uriFilesReader_1.default)([httpsUri], "utf8").then((data) => {
            assert(false, "Expected promise to be rejected.");
        }, (err) => {
            assert(err.code === "ENOENT");
        });
    });
});
//# sourceMappingURL=uriFilesReader.test.js.map