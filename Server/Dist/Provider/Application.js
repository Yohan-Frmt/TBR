"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const kue_1 = __importDefault(require("kue"));
const path = __importStar(require("path"));
const Database_1 = require("../Config/Database");
const Log_1 = __importDefault(require("../Middleware/Log"));
const Express_1 = __importDefault(require("./Express"));
const Locals_1 = __importDefault(require("./Locals"));
class Application {
    ClearConsole() {
        process.stdout.write("\x1B[2J\x1B[0f");
    }
    LoadConfiguration() {
        Log_1.default.Info("[Configuration] Loading...");
        dotenv.config({ path: path.join(__dirname, "../../.env") });
    }
    LoadExpressServer() {
        Log_1.default.Info("[Server] Loading...");
        Express_1.default.Initialise();
    }
    LoadDatabase() {
        Log_1.default.Info("[Database] Loading...");
        Database_1.Database.Initialise();
    }
    LoadWorker() {
        Log_1.default.Info("[Worker] Loading...");
    }
    LoadQueue() {
        const isQueueMonitorEnabled = Locals_1.default.Config().queueMonitor;
        const queueMonitorPort = Locals_1.default.Config().queueMonitorHttpPort;
        if (isQueueMonitorEnabled) {
            kue_1.default.app.listen(queueMonitorPort);
            Log_1.default.Info(`[Queue Monitor] Running @ 'http://127.0.0.1:${queueMonitorPort}'`);
        }
    }
}
exports.default = new Application();
//# sourceMappingURL=Application.js.map