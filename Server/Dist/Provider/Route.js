"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = __importDefault(require("../Middleware/Log"));
const Routes_1 = require("../Routes");
const Locals_1 = __importDefault(require("./Locals"));
class Route {
    constructor() {
        this.EnableApi = (express) => {
            const apiPrefix = Locals_1.default.Config().apiPrefix;
            Log_1.default.Info('[Routes] Mounting API Routes...');
            return express.use(`/${apiPrefix}`, Routes_1.api);
        };
        this.EnableUser = (express) => {
            const apiPrefix = Locals_1.default.Config().apiPrefix;
            Log_1.default.Info('[Routes] Mounting User Routes...');
            return express.use(`/${apiPrefix}`, Routes_1.user);
        };
        this.EnableLobby = (express) => {
            const apiPrefix = Locals_1.default.Config().apiPrefix;
            Log_1.default.Info('[Routes] Mounting Lobby Routes...');
            return express.use(`/${apiPrefix}`, Routes_1.lobby);
        };
    }
}
exports.default = new Route;
//# sourceMappingURL=Route.js.map