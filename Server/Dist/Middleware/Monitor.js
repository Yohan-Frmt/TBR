"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_status_monitor_1 = __importDefault(require("express-status-monitor"));
const Locals_1 = __importDefault(require("../Provider/Locals"));
const Log_1 = __importDefault(require("./Log"));
class Monitor {
    constructor() {
        this.EndpointToCheck = () => {
            const apiPrefix = Locals_1.default.Config().apiPrefix;
            const apiPort = Locals_1.default.Config().apiPort;
            const socketPrefix = Locals_1.default.Config().socketPrefix;
            const socketPort = Locals_1.default.Config().socketPort;
            const rootApiEP = {
                protocol: 'http',
                host: '127.0.0.1',
                path: '/',
                port: `${apiPort}`
            };
            const apiEP = {
                protocol: 'http',
                host: '127.0.0.1',
                path: `/${apiPrefix}`,
                port: `${apiPort}`
            };
            const rootSocketEP = {
                protocol: 'http',
                host: '127.0.0.1',
                path: '/',
                port: `${socketPort}`
            };
            const socketEP = {
                protocol: 'websocket',
                host: '127.0.0.1',
                path: `/${socketPrefix}`,
                port: `${socketPort}`
            };
            return [
                rootApiEP, rootSocketEP, apiEP, socketEP
            ];
        };
    }
    Enable(express) {
        Log_1.default.Info(`[Middleware] Enable Monitor middleware...`);
        const monitorOptions = {
            title: Locals_1.default.Config().name,
            path: '/status-monitor',
            spans: [
                {
                    interval: 1,
                    retention: 60
                },
                {
                    interval: 5,
                    retention: 60
                },
                {
                    interval: 15,
                    retention: 60
                }
            ],
            chartVisibility: {
                mem: true,
                rps: true,
                cpu: true,
                load: true,
                statusCodes: true,
                responseTime: true
            },
            healthChecks: this.EndpointToCheck(),
        };
        express.use((0, express_status_monitor_1.default)(monitorOptions));
        return express;
    }
}
exports.default = new Monitor;
//# sourceMappingURL=Monitor.js.map