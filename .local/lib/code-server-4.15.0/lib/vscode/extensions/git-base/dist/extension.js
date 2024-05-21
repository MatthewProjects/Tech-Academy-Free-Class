(()=>{"use strict";var e={699:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.$Pfc=t.$Ofc=void 0;const o=r(496),i=r(571);t.$Ofc=class{constructor(e){this.a=e}pickRemoteSource(e){return(0,i.$Mfc)(this.a,e)}getRemoteSourceActions(e){return(0,i.$Lfc)(this.a,e)}registerRemoteSourceProvider(e){return this.a.registerRemoteSourceProvider(e)}},t.$Pfc=function(e){const t=[];return t.push(o.commands.registerCommand("git-base.api.getRemoteSources",(t=>{if(e.model)return(0,i.$Mfc)(e.model,t)}))),o.Disposable.from(...t)}},413:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.$Nfc=void 0;const o=r(496),i=r(699);t.$Nfc=class{set model(e){this.b=e;const t=!!e;this.enabled!==t&&(this.enabled=t,this.a.fire(this.enabled))}get model(){return this.b}constructor(e){this.enabled=!1,this.a=new o.EventEmitter,this.onDidChangeEnablement=this.a.event,this.b=void 0,e&&(this.enabled=!0,this.b=e)}getAPI(e){if(!this.b)throw new Error("Git model not found");if(1!==e)throw new Error(`No API version ${e} found.`);return new i.$Ofc(this.b)}}},874:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.$Jfc=t.$Ifc=void 0;const o=r(575);function i(e){return(t,r,o)=>{let i=null,n=null;if("function"==typeof o.value?(i="value",n=o.value):"function"==typeof o.get&&(i="get",n=o.get),!n||!i)throw new Error("not supported");o[i]=e(n,r)}}t.$Ifc=function(e){return i(((t,r)=>{const o=`$debounce$${r}`;return function(...r){clearTimeout(this[o]),this[o]=setTimeout((()=>t.apply(this,r)),e)}}))},t.$Jfc=i((function(e,t){const r=`$throttle$current$${t}`,i=`$throttle$next$${t}`,n=function(...t){if(this[i])return this[i];if(this[r])return this[i]=(0,o.done)(this[r]).then((()=>(this[i]=void 0,n.apply(this,t)))),this[i];this[r]=e.apply(this,t);const s=()=>this[r]=void 0;return(0,o.done)(this[r]).then(s,s),this[r]};return n}))},74:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.$Kfc=void 0;const o=r(496),i=r(575);t.$Kfc=class{constructor(){this.a=new Set,this.b=new o.EventEmitter,this.onDidAddRemoteSourceProvider=this.b.event,this.c=new o.EventEmitter,this.onDidRemoveRemoteSourceProvider=this.c.event}registerRemoteSourceProvider(e){return this.a.add(e),this.b.fire(e),(0,i.$Gfc)((()=>{this.a.delete(e),this.c.fire(e)}))}getRemoteProviders(){return[...this.a.values()]}}},571:function(e,t,r){var o=this&&this.__decorate||function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var c=e.length-1;c>=0;c--)(i=e[c])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};Object.defineProperty(t,"__esModule",{value:!0}),t.$Mfc=t.$Lfc=void 0;const i=r(496),n=r(874);async function s(e){const t=await new Promise((t=>{e.onDidAccept((()=>t(e.selectedItems[0]))),e.onDidHide((()=>t(void 0))),e.show()}));return e.hide(),t}class c{constructor(e){this.e=e}f(){this.d||(this.d=i.window.createQuickPick(),this.d.ignoreFocusOut=!0,this.e.supportsQuery?(this.d.placeholder=this.e.placeholder??i.l10n.t("Repository name (type to search)"),this.d.onDidChangeValue(this.g,this)):this.d.placeholder=this.e.placeholder??i.l10n.t("Repository name"))}g(){this.h()}async h(){try{this.f(),this.d.busy=!0,this.d.show();const e=await this.e.getRemoteSources(this.d?.value)||[];0===e.length?this.d.items=[{label:i.l10n.t("No remote repositories found."),alwaysShow:!0}]:this.d.items=e.map((e=>({label:e.icon?`$(${e.icon}) ${e.name}`:e.name,description:e.description||("string"==typeof e.url?e.url:e.url[0]),detail:e.detail,remoteSource:e,alwaysShow:!0})))}catch(e){this.d.items=[{label:i.l10n.t("{0} Error: {1}","$(error)",e.message),alwaysShow:!0}],console.error(e)}finally{this.d.busy=!1}}async pick(){return await this.h(),(await s(this.d))?.remoteSource}}async function a(e,t={}){const r=new c(e),o=await r.pick();let n;if(o&&("string"==typeof o.url?n=o.url:o.url.length>0&&(n=await i.window.showQuickPick(o.url,{ignoreFocusOut:!0,placeHolder:i.l10n.t("Choose a URL to clone from.")}))),!n||!t.branch)return n;if(!e.getBranches)return{url:n};const s=await e.getBranches(n);if(!s)return{url:n};const a=await i.window.showQuickPick(s,{placeHolder:i.l10n.t("Branch name")});return a?{url:n,branch:a}:{url:n}}o([(0,n.$Ifc)(300)],c.prototype,"g",null),o([n.$Jfc],c.prototype,"h",null),t.$Lfc=async function(e,t){const r=e.getRemoteProviders(),o=[];for(const e of r){const r=await(e.getRemoteSourceActions?.(t));r?.length&&o.push(...r)}return o},t.$Mfc=async function(e,t={}){const r=i.window.createQuickPick();if(r.title=t.title,t.providerName){const r=e.getRemoteProviders().filter((e=>e.name===t.providerName))[0];if(r)return await a(r,t)}const o=e.getRemoteProviders().map((e=>({label:(e.icon?`$(${e.icon}) `:"")+(t.providerLabel?t.providerLabel(e):e.name),alwaysShow:!0,provider:e}))),n=[];if(t.showRecentSources)for(const{provider:e}of o){const t=(await(e.getRecentRemoteSources?.())??[]).map((e=>({...e,label:(e.icon?`$(${e.icon}) `:"")+e.name,url:"string"==typeof e.url?e.url:e.url[0]})));n.push(...t)}const c=[{kind:i.QuickPickItemKind.Separator,label:i.l10n.t("remote sources")},...o,{kind:i.QuickPickItemKind.Separator,label:i.l10n.t("recently opened")},...n.sort(((e,t)=>t.timestamp-e.timestamp))];r.placeholder=t.placeholder??(0===o.length?i.l10n.t("Provide repository URL"):i.l10n.t("Provide repository URL or pick a repository source."));const l=e=>{if(e){const o=("string"==typeof t.urlLabel?t.urlLabel:t.urlLabel?.(e))??i.l10n.t("URL");r.items=[{label:o,description:e,alwaysShow:!0,url:e},...c]}else r.items=c};r.onDidChangeValue(l),l();const u=await s(r);if(u){if(u.url)return u.url;if(u.provider)return await a(u.provider,t)}}},575:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.Versions=t.done=t.$Gfc=void 0,t.$Gfc=function(e){return{dispose:e}},t.done=function(e){return e.then((()=>{}))},function(e){function t(e,t,r,o){return{major:"string"==typeof e?parseInt(e,10):e,minor:"string"==typeof t?parseInt(t,10):t,patch:null==r?0:"string"==typeof r?parseInt(r,10):r,pre:o}}function r(e){const[r,o]=e.split("-"),[i,n,s]=r.split(".");return t(i,n,s,o)}e.compare=function(e,t){return"string"==typeof e&&(e=r(e)),"string"==typeof t&&(t=r(t)),e.major>t.major?1:e.major<t.major?-1:e.minor>t.minor?1:e.minor<t.minor?-1:e.patch>t.patch?1:e.patch<t.patch?-1:void 0===e.pre&&void 0!==t.pre?1:void 0!==e.pre&&void 0===t.pre?-1:void 0!==e.pre&&void 0!==t.pre?e.pre.localeCompare(t.pre):0},e.from=t,e.fromString=r}(r||(t.Versions=r={}))},496:e=>{e.exports=require("vscode")}},t={};function r(o){var i=t[o];if(void 0!==i)return i.exports;var n=t[o]={exports:{}};return e[o].call(n.exports,n,n.exports,r),n.exports}var o={};(()=>{var e=o;Object.defineProperty(e,"__esModule",{value:!0}),e.activate=void 0;const t=r(699),i=r(413),n=r(74);e.activate=function(e){const r=new i.$Nfc(new n.$Kfc);return e.subscriptions.push((0,t.$Pfc)(r)),r}})();var i=exports;for(var n in o)i[n]=o[n];o.__esModule&&Object.defineProperty(i,"__esModule",{value:!0})})();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/74f6148eb9ea00507ec113ec51c489d6ffb4b771/extensions/git-base/dist/extension.js.map