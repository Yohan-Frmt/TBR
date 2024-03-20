"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Locals_1 = __importDefault(require("../Provider/Locals"));
const Cors_1 = __importDefault(require("./Cors"));
const Http_1 = __importDefault(require("./Http"));
const Monitor_1 = __importDefault(require("./Monitor"));
class Middleware {
    static Initialise(express) {
        if (Locals_1.default.Config().corsEnabled)
            express = Cors_1.default.Enable(express);
        express = Http_1.default.Enable(express);
        // express = CsrfToken.Enable(express);
        // express = Statics.Enable(express);
        express = Monitor_1.default.Enable(express);
        return express;
    }
}
exports.default = Middleware;
//# sourceMappingURL=Middleware.js.map