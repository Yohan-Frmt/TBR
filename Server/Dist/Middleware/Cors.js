"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const Locals_1 = __importDefault(require("../Provider/Locals"));
const Log_1 = __importDefault(require("./Log"));
class Cors {
    Enable(express) {
        Log_1.default.Info(`[Middleware] Enable Cors middleware...`);
        const options = {
            origin: Locals_1.default.Config().allowListHosts || Locals_1.default.Config().apiUrl,
            optionsSuccessStatus: 200
        };
        express.use((0, cors_1.default)(options));
        return express;
    }
}
exports.default = new Cors;
//# sourceMappingURL=Cors.js.map