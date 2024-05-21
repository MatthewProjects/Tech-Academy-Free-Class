'use strict';
var vscode = require('vscode');
function activate(context) {
    var BrowserContentProvider = (function () {
        function BrowserContentProvider() {
        }
        BrowserContentProvider.prototype.provideTextDocumentContent = function (uri, token) {
            // TODO: detect failure to load page (e.g. google.com) and display error to user.
            return "<iframe src=\"" + uri + "\" frameBorder=\"0\" style=\"width: 100%; height: 100%\" />";
        };
        return BrowserContentProvider;
    }());
    var provider = new BrowserContentProvider();
    // Handle http:// and https://.
    var registrationHTTPS = vscode.workspace.registerTextDocumentContentProvider('https', provider);
    var registrationHTTP = vscode.workspace.registerTextDocumentContentProvider('http', provider);
    // urlIsValid returns true if url is valid; false otherwise.
    // TODO: test more robustly.
    function urlIsValid(url) {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return true;
        }
        return false;
    }
    var disposable = vscode.commands.registerCommand('extension.openURL', function () {
        var opts = {
            prompt: "URL",
            value: "https://",
            validateInput: function (url) {
                if (urlIsValid(url)) {
                    return null;
                }
                return "Invalid URL.";
            },
        };
        vscode.window.showInputBox(opts).then(function (url) {
            if (!urlIsValid(url)) {
                return;
            }
            var uri = vscode.Uri.parse(url);
            // Determine column to place browser in.
            var col;
            var ae = vscode.window.activeTextEditor;
            if (ae != undefined) {
                col = ae.viewColumn || vscode.ViewColumn.One;
            }
            else {
                col = vscode.ViewColumn.One;
            }
            return vscode.commands.executeCommand('vscode.previewHtml', uri, col).then(function (success) {
            }, function (reason) {
                vscode.window.showErrorMessage(reason);
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map