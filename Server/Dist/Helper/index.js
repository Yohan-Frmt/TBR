"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.FixHosts = exports.GenerateUUID = exports.GenerateShitUUID = void 0;
const uuid_1 = require("uuid");
const GenerateShitUUID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${s4() + s4()}-${s4()}`;
};
exports.GenerateShitUUID = GenerateShitUUID;
const GenerateUUID = () => (0, uuid_1.v4)();
exports.GenerateUUID = GenerateUUID;
const FixHosts = (hosts) => {
    const hasPort = /(https?:\/\/.*):(\d*)\/?(.*)/g;
    return hosts.map((host) => {
        if (host.match(hasPort) == null) {
            if (host.includes("https"))
                return `${host}:443`;
            if (host.includes("http"))
                return `${host}:80`;
        }
        return host;
    });
};
exports.FixHosts = FixHosts;
const hash = (x) => {
    let h = x | 0;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h ^= h >> 16;
    return h;
};
exports.hash = hash;
//# sourceMappingURL=index.js.map