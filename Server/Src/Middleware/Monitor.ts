import { Application } from "express";
import expressStatusMonitor from 'express-status-monitor';
import Locals from "../Provider/Locals";
import Log from "./Log";

class Monitor {
    public Enable(express: Application): Application {
        Log.Info(`[Middleware] Enable Monitor middleware...`);

        const monitorOptions: object = {
            title: Locals.Config().name,
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
        express.use(expressStatusMonitor(monitorOptions));
        return express;
    }

    private EndpointToCheck = () => {
        const apiPrefix: string = Locals.Config().apiPrefix;
        const apiPort: number = Locals.Config().apiPort;
        const socketPrefix: string = Locals.Config().socketPrefix;
        const socketPort: number = Locals.Config().socketPort;

        const rootApiEP = {
            protocol: 'http',
            host: '127.0.0.1',
            path: '/',
            port: `${ apiPort }`
        };
        const apiEP = {
            protocol: 'http',
            host: '127.0.0.1',
            path: `/${ apiPrefix }`,
            port: `${ apiPort }`
        };
        const rootSocketEP = {
            protocol: 'http',
            host: '127.0.0.1',
            path: '/',
            port: `${ socketPort }`
        };
        const socketEP = {
            protocol: 'websocket',
            host: '127.0.0.1',
            path: `/${ socketPrefix }`,
            port: `${ socketPort }`
        };
        return [
            rootApiEP, rootSocketEP, apiEP, socketEP
        ]
    }
}

export default new Monitor;
