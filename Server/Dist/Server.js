"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("./Handler/Event"));
const Application_1 = __importDefault(require("./Provider/Application"));
Event_1.default.Process();
Application_1.default.ClearConsole();
Application_1.default.LoadConfiguration();
// Application.LoadDatabase();
Application_1.default.LoadExpressServer();
// Application.LoadQueue();
// if (cluster.isPrimary) {
//     Event.Process();
//     Application.ClearConsole();
//     Application.LoadConfiguration();
//     const CPUS: os.CpuInfo[] = os.cpus();
//     CPUS.forEach(() => cluster.fork());
//     Event.Cluster(cluster);
//     Application.LoadQueue();
//     setTimeout(() => Application.LoadWorker(), 1000 * 60);
// } else {
//     Application.LoadDatabase();
//     Application.LoadExpressServer();
// }
//# sourceMappingURL=Server.js.map