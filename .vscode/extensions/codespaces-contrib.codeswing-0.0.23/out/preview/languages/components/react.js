"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileComponent = void 0;
const script_1 = require("../script");
function getComponentName(code) {
    const [, component] = code.match(/export\sdefault\s(?:(?:class|function)\s)?(\w+)?/);
    return component;
}
async function compileComponent(content, document) {
    const [code] = (await script_1.getScriptContent(document, { scripts: ["react"] }));
    const componentName = getComponentName(code);
    const isReactNative = code.includes("6de9be49a0f112dd36eff3b8bc771b9e");
    const init = isReactNative ? `import { AppRegistry } from "https://gistcdn.githack.com/lostintangent/6de9be49a0f112dd36eff3b8bc771b9e/raw/ce12b9075322245be20a79eba4d89d4e5152a4aa/index.js";
    AppRegistry.registerComponent("App", () => ${componentName});
    
    AppRegistry.runApplication("App", {
      rootTag: document.getElementById("app")
    });` : `ReactDOM.render(React.createElement(${componentName}), document.getElementById("app"));`;
    return [code, init];
}
exports.compileComponent = compileComponent;
//# sourceMappingURL=react.js.map