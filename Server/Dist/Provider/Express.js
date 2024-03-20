"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
const express_1 = __importDefault(require("express"));
const Exception_1 = require("../Handler/Exception");
const Middleware_1 = __importDefault(require("../Middleware/Middleware"));
const Locals_1 = __importDefault(require("./Locals"));
const Route_1 = __importDefault(require("./Route"));
const Socket_1 = __importDefault(require("./Socket"));
class Express {
    constructor() {
        this.EnableDotEnv = () => {
            this.server = Locals_1.default.Initialise(this.server);
        };
        this.EnableSocket = () => {
            Socket_1.default.Initialise(this.server);
        };
        this.EnableMiddlewares = () => {
            this.server = Middleware_1.default.Initialise(this.server);
        };
        this.EnableRoutes = () => {
            this.server = Route_1.default.EnableApi(this.server);
            this.server = Route_1.default.EnableUser(this.server);
            this.server = Route_1.default.EnableLobby(this.server);
        };
        this.Initialise = () => {
            const apiPort = Locals_1.default.Config().apiPort;
            this.server.use(Exception_1.Exception.LogErrors);
            this.server.use(Exception_1.Exception.ClientErrorHandler);
            this.server.use(Exception_1.Exception.ErrorHandler);
            this.server = Exception_1.Exception.NotFoundHandler(this.server);
            this.server
                .listen(apiPort, () => consola_1.default.info("\x1b[36m%s\x1b[0m", `[Server] Running on 'http://127.0.0.1:${apiPort}'`))
                .on("error", (err) => consola_1.default.error("\x1b[31m%s\x1b[0m", `[Error] ${err.message}`));
        };
        this.server = (0, express_1.default)();
        this.EnableSocket();
        this.EnableDotEnv();
        this.EnableMiddlewares();
        this.EnableRoutes();
    }
}
exports.default = new Express();
//# sourceMappingURL=Express.js.map