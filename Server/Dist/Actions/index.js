"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.classes = void 0;
const UserActions_1 = require("./UserActions");
const ExtractFunctionParams = (func) => {
    const fnStr = func
        .toString()
        .replace(/(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm, "");
    let params = fnStr
        .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
        .match(/([^\s,]+)/g) || [];
    // Dealing with parameters passed as an object
    while (params.indexOf("{") !== -1) {
        const objStartIndex = params.indexOf("{");
        const objEndIndex = params.indexOf("}");
        params.splice(objStartIndex, objEndIndex - objStartIndex);
        params[objStartIndex] = params.slice(objStartIndex + 1, objEndIndex);
    }
    return params;
};
exports.classes = {
    Users: UserActions_1.UserActions,
};
const getMethodsFromClass = (classRef) => {
    return Object.getOwnPropertyNames(classRef).filter((e) => typeof classRef[e] === "function");
};
const processClassMethods = (classRef, methodNames) => methodNames.reduce((acc, name) => (Object.assign(Object.assign({}, acc), { [name]: ExtractFunctionParams(classRef[name])[2] || [] })), {});
exports.config = Object.keys(exports.classes).reduce((func, key) => {
    const classRef = exports.classes[key];
    const methodNames = getMethodsFromClass(classRef);
    return Object.assign(Object.assign({}, func), { [key]: processClassMethods(classRef, methodNames) });
}, {});
//# sourceMappingURL=index.js.map