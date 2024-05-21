"use strict";var e,t=require("vscode"),n=require("path");function i(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}!function(e){e.NEVER="Never",e.SAVE="Save",e.ALWAYS="Always"}(e||(e={}));var o={}.toString,s=Array.isArray||function(e){return"[object Array]"==o.call(e)},r=s,a=s,c=function(e){return null!=e&&"object"==typeof e&&!1===r(e)},l=g;function g(e,t){if(!(this instanceof g))return"number"==typeof t?new g(e).fromIndex(t):new g(e,t);this.str=e||"",this.lineToIndex=function(e){for(var t=e.split("\n"),n=new Array(t.length),i=0,o=0,s=t.length;o<s;o++)n[o]=i,i+=t[o].length+1;return n}(this.str),t=t||{},this.origin=void 0===t.origin?1:t.origin}g.prototype.fromIndex=function(e){if(e<0||e>=this.str.length||isNaN(e))return null;var t=function(e,t){if(e>=t[t.length-1])return t.length-1;var n,i=0,o=t.length-2;for(;i<o;)if(e<t[n=i+(o-i>>1)])o=n-1;else{if(!(e>=t[n+1])){i=n;break}i=n+1}return i}(e,this.lineToIndex);return{line:t+this.origin,col:e-this.lineToIndex[t]+this.origin}},g.prototype.toIndex=function(e,t){if(void 0===t)return a(e)&&e.length>=2?this.toIndex(e[0],e[1]):c(e)&&"line"in e&&("col"in e||"column"in e)?this.toIndex(e.line,"col"in e?e.col:e.column):-1;if(isNaN(e)||isNaN(t))return-1;if(e-=this.origin,t-=this.origin,e>=0&&t>=0&&e<this.lineToIndex.length){var n=this.lineToIndex[e];if(t<(e===this.lineToIndex.length-1?this.str.length:this.lineToIndex[e+1])-n)return n+t}return-1};var u,f=i(l);function d(e){const t=/([.#])(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?=[#.,()\s\[\]\^:*"'>=_a-zA-Z0-9-]*{[^}]*})/g,n=[],i=f(e,{origin:0});let o,s,r,a=0,c=0;for(;o=t.exec(e);)r=o.index,s=i.fromIndex(r),s&&(a=s.line,c=s.col+1),n.push({index:r,line:a,col:c,type:o[1],selector:o[2]});return n}!function(e){e.ID="#",e.CLASS="."}(u||(u={}));const h=new t.Position(0,0),m=new Map;const p=t.workspace.getConfiguration("css").get("enabledLanguages",["html"]),w=t.languages.createDiagnosticCollection(),x=new class{get isRemote(){return/^https?:\/\//i}get wordRange(){return/[_a-zA-Z0-9-]+/}get canComplete(){return/(id|class|className)\s*[=:]\s*(["'])(?:.(?!\2))*$/is}async fetch(e){try{const t=await fetch(e);if(t.ok)return t.text();throw new Error(t.statusText)}catch(n){t.window.showErrorMessage(`Fetching ${e} failed. ${n}`)}return""}async getRemote(e){let t=m.get(e);if(!t){t=d(await this.fetch(e)),m.set(e,t)}return t}async getLocal(e){const n=e.toString();let i=m.get(n);if(!i){i=d((await t.workspace.fs.readFile(e)).toString()),m.set(n,i)}return i}getRelativePattern(e,n){return new t.RelativePattern(e,n).pattern}async getStyles(e){const i=new Map,o=t.workspace.getWorkspaceFolder(e.uri),s=function(e){const i=n.parse(e.fileName);return t.workspace.getConfiguration("css",e).get("styleSheets",[]).map((e=>e.replace(/\$\s*{\s*(fileBasenameNoExtension|fileBasename)\s*}/g,((e,t)=>"fileBasename"===t?i.base:i.name))))}(e);for(const e of s)if(this.isRemote.test(e))i.set(e,await this.getRemote(e));else if(o){const n=await t.workspace.findFiles(this.getRelativePattern(o,e));for(const e of n)i.set(e.toString(),await this.getLocal(e))}return i.set(e.uri.toString(),d(e.getText())),i}async getCompletionMap(e,n){const i=new Map,o=await this.getStyles(e);for(const e of o.values())for(const o of e)if(o.type===n){const e=new t.CompletionItem(o.selector,o.type===u.ID?t.CompletionItemKind.Value:t.CompletionItemKind.Enum);i.set(o.selector,e)}return i}async getCompletionItems(e,t,n){const i=await this.getCompletionMap(e,n),o=e.getWordRangeAtPosition(t,this.wordRange),s=[];for(const e of i.values())e.range=o,s.push(e);return s}provideCompletionItems(e,n,i,o){const s=new t.Range(h,n),r=e.getText(s),a=this.canComplete.exec(r);return new Promise(((t,o)=>a&&!i.isCancellationRequested?t(this.getCompletionItems(e,n,"id"===a[1]?u.ID:u.CLASS)):o()))}async getDefinitions(e,n){const i=await this.getStyles(e),o=e.getWordRangeAtPosition(n,this.wordRange),s=e.getText(o),r=[];for(const e of i)this.isRemote.test(e[0])||e[1].filter((e=>e.selector===s)).forEach((n=>r.push(new t.Location(t.Uri.parse(e[0]),new t.Position(n.line,n.col)))));return r}provideDefinition(e,n,i){const o=new t.Range(h,n),s=e.getText(o),r=this.canComplete.exec(s);return new Promise(((t,o)=>r&&!i.isCancellationRequested?t(this.getDefinitions(e,n)):o()))}async validate(e){const n=/([^(\[{}\])\s]+)(?![^(\[{]*[}\])])/gi,i=/(class|className)\s*[=:]\s*(["'])(.*?)\2/gis,o=[],s=await this.getCompletionMap(e,u.CLASS),r=e.getText();let a,c,l,g,f,d;for(;a=i.exec(r);)for(c=i.lastIndex-a[3].length+a[3].indexOf(a[2]);l=n.exec(a[3]);)s.has(l[1])||(g=n.lastIndex+c,f=e.positionAt(g),d=e.positionAt(g-l[1].length),o.push(new t.Diagnostic(new t.Range(d,f),`CSS selector '${l[1]}' not found.`,t.DiagnosticSeverity.Warning)));return o}};async function v(n,i){if(p.includes(n.languageId)){const s=(o=n,t.workspace.getConfiguration("css",o).get("autoValidation",e.NEVER));i&&i!==s?s!==e.ALWAYS&&w.delete(n.uri):w.set(n.uri,await x.validate(n))}var o}exports.activate=function(n){return n.subscriptions.push(t.languages.registerCompletionItemProvider(p,x),t.languages.registerDefinitionProvider(p,x),t.workspace.onDidSaveTextDocument((async t=>{var n;n=t.uri.toString(),m.delete(n),await v(t,e.SAVE)})),t.workspace.onDidOpenTextDocument((async t=>{await v(t,e.ALWAYS)})),t.workspace.onDidChangeTextDocument((async t=>{t.contentChanges.length>0&&await v(t.document,e.ALWAYS)})),t.workspace.onDidCloseTextDocument((e=>{w.delete(e.uri)})),t.commands.registerCommand("vscode-html-css.validate",(async e=>{const n=t.window.activeTextEditor;n&&await v(n.document,e)})),t.commands.registerCommand("vscode-html-css.clear",(()=>(t.window.showInformationMessage(`Style sheets cache cleared: ${m.size}`),void m.clear())))),t.commands.executeCommand("vscode-html-css.validate",e.ALWAYS)},exports.deactivate=function(){};
