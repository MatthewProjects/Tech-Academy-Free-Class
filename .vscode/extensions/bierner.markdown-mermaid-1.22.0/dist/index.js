(()=>{"use strict";var e={228:e=>{e.exports=function(e,r,n){var t=(n=n||{}).marker||":",o=t.charCodeAt(0),a=t.length,i=n.validate||function(e){return e.trim().split(" ",2)[0]===r},s=n.render||function(e,n,t,o,a){return 1===e[n].nesting&&e[n].attrJoin("class",r),a.renderToken(e,n,t,o,a)};e.block.ruler.before("fence","container_"+r,(function(e,n,s,c){var l,u,d,p,f,g,m,h,k=!1,b=e.bMarks[n]+e.tShift[n],v=e.eMarks[n];if(o!==e.src.charCodeAt(b))return!1;for(l=b+1;l<=v&&t[(l-b)%a]===e.src[l];l++);if((d=Math.floor((l-b)/a))<3)return!1;if(l-=(l-b)%a,p=e.src.slice(b,l),f=e.src.slice(l,v),!i(f,p))return!1;if(c)return!0;for(u=n;!(++u>=s||(b=e.bMarks[u]+e.tShift[u])<(v=e.eMarks[u])&&e.sCount[u]<e.blkIndent);)if(o===e.src.charCodeAt(b)&&!(e.sCount[u]-e.blkIndent>=4)){for(l=b+1;l<=v&&t[(l-b)%a]===e.src[l];l++);if(!(Math.floor((l-b)/a)<d||(l-=(l-b)%a,(l=e.skipSpaces(l))<v))){k=!0;break}}return m=e.parentType,h=e.lineMax,e.parentType="container",e.lineMax=u,(g=e.push("container_"+r+"_open","div",1)).markup=p,g.block=!0,g.info=f,g.map=[n,u],e.md.block.tokenize(e,n+1,u),(g=e.push("container_"+r+"_close","div",-1)).markup=e.src.slice(b,l),g.block=!0,e.parentType=m,e.lineMax=h,e.line=u+(k?1:0),!0}),{alt:["paragraph","reference","blockquote","list"]}),e.renderer.rules["container_"+r+"_open"]=s,e.renderer.rules["container_"+r+"_close"]=s}}},r={};function n(t){var o=r[t];if(void 0!==o)return o.exports;var a=r[t]={exports:{}};return e[t](a,a.exports,n),a.exports}n.d=(e,r)=>{for(var t in r)n.o(r,t)&&!n.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},n.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};(()=>{n.r(t),n.d(t,{activate:()=>d});var e=n(228);const r="mermaid",o="inline",a="container_"+r+"_open",i="container_"+r+"_close";function s(e){return e.replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\n+$/,"").trimStart()}function c(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}const l=require("vscode"),u="markdown-mermaid";function d(n){return n.subscriptions.push(l.workspace.onDidChangeConfiguration((e=>{(e.affectsConfiguration(u)||e.affectsConfiguration("workbench.colorTheme"))&&l.commands.executeCommand("markdown.preview.refresh")}))),{extendMarkdownIt:n=>(function(n,t){n.use(e,r,{anyClass:!0,validate:e=>e.trim()===r,render:(e,n)=>{const t=e[n];var c="";if(t.type===a)for(var l=n+1;l<e.length;l++){const r=e[l];if(void 0===r||r.type===i)break;c+=r.content,r.block&&r.nesting<=0&&(c+="\n"),r.tag="",r.type=o,r.children=[]}return 1===t.nesting?`<div class="${r}">${s(c)}`:"</div>"}});const l=n.options.highlight;n.options.highlight=(e,n)=>{const o=new RegExp("\\b("+t.languageIds().map(c).join("|")+")\\b","i");return n&&o.test(n)?`<pre style="all:unset;"><div class="${r}">${s(e)}</div></pre>`:l(e,n)}}(n,{languageIds:()=>l.workspace.getConfiguration(u).get("languages",["mermaid"])}),n.use(m),n)}}const p="default",f=["base","forest","dark","default","neutral"];function g(e){return"string"==typeof e&&f.includes(e)?e:p}function m(e){const r=e.renderer.render;return e.renderer.render=function(){const n=g(l.workspace.getConfiguration(u).get("darkModeTheme")),t=g(l.workspace.getConfiguration(u).get("lightModeTheme"));return`<span id="${u}" aria-hidden="true"\n                    data-dark-mode-theme="${n}"\n                    data-light-mode-theme="${t}"></span>\n                ${r.apply(e.renderer,arguments)}`},e}})(),module.exports=t})();
//# sourceMappingURL=index.js.map