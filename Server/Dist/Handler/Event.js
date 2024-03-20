"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = __importDefault(require("../Middleware/Log"));
class Event {
    Cluster(cluster) {
        cluster.on('listening', (worker) => {
            Log_1.default.Info(`[Cluster] PID '${worker.process.pid}' Connected!`);
        });
        cluster.on('online', (worker) => {
            Log_1.default.Info(`[Cluster] PID '${worker.process.pid}' forked!`);
        });
        cluster.on('disconnect', (worker) => {
            Log_1.default.Info(`[Cluster] PID '${worker.process.pid}' Disconnected!`);
        });
        cluster.on('exit', (worker, code, signal) => {
            Log_1.default.Info(`[Cluster] PID '${worker.process.pid}' is Dead with Code '${code}, and signal: '${signal}'`);
            cluster.fork();
        });
    }
    Process() {
        process.on('uncaughtException', (exception) => {
            Log_1.default.Error(`[Error] ${exception.stack}` || '[Error] Unknown error');
        });
        process.on('warning', (warning) => {
            Log_1.default.Warn(`[Error] ${warning.stack}` || '[Error] Unknown error');
        });
    }
}
exports.default = new Event();
//# sourceMappingURL=Event.js.map