import * as dotenv from "dotenv";
import { Application } from "express";
import * as path from "path";
import * as process from "process";

class Locals {
    public static Config = () => {
        dotenv.config({ path: path.join(__dirname, "../../.env") });

        const nodeEnv: string = process.env.NODE_ENV || "development";
        const name: string = process.env.APP_NAME || "NodeTS Dashboard";
        const description: string = process.env.APP_DESCRIPTION || "Here goes the app description";
        const year: number = new Date().getFullYear();
        const copyright: string = `Copyright ${ year } ${ name } | All Rights Reserved`;
        const allowListHosts: string[] | undefined =
            nodeEnv === "development"
                ? process.env.ALLOW_LIST_HOSTS_DEV?.split(",")
                : process.env.ALLOW_LIST_HOSTS_PROD?.split(",");
        const apiUrl: string = process.env.API_URL || `http://localhost:${ process.env.API_PORT }`;
        const socketUrl: string = process.env.SOCKET_URL || `ws://localhost:${ process.env.SOCKET_PORT }`;
        const apiPort: number = Number(process.env.API_PORT) || 8080;
        const socketPort: number = Number(process.env.SOCKET_PORT) || 80;
        // const mongooseUrl: string = process.env.MONGOOSE_URL || "NO URL FOUND";
        const mongooseUrl: string | undefined =
            nodeEnv === "development"
                ? process.env.MONGOOSE_URL_LOCAL
                : process.env.MONGOOSE_URL
        const defaultMaxPlayer: number = Number(process.env.DEFAULT_MAX_PLAYERS);
        const defaultTimeLimit: number = Number(process.env.DEFAULT_TIME_LIMIT);
        const exitSuccess: number = Number(process.env.EXIT_SUCCESS);
        const exitFailure: number = Number(process.env.EXIT_FAILURE);
        const appSecret: string = process.env.APP_SECRET || "CHANGE IT!";
        const salt: number = Number(process.env.SALT);
        const metadataNetworkInterfaceUrl: string = process.env.METADATA_NETWORK_INTERFACE_URL || "CHANGE IT!";
        const logDays: number = Number(process.env.LOG_DAYS) || 10;
        const corsEnabled: boolean = Boolean(process.env.CORS_ENABLED) || true;
        const apiPrefix: string = process.env.API_PREFIX || "api";
        const socketPrefix: string = process.env.SOCKET_PREFIX || "socket.io";
        const jwtExpiresIn: number = Number(process.env.JWT_EXPIRES_IN) || 2;
        const queueMonitor: boolean = Boolean(process.env.QUEUE_HTTP_ENABLED) || true;
        const queueMonitorHttpPort: number = Number(process.env.QUEUE_HTTP_PORT) || 5550;
        const redisPort: number = Number(process.env.REDIS_PORT) || 6379;
        const redisHost: string = process.env.REDIS_HOST || "localhost";
        const redisPrefix: string = process.env.REDIS_QUEUE_DB || "q";
        const redisDB: number = Number(process.env.REDIS_QUEUE_PREFIX) || 3;

        return {
            nodeEnv,
            name,
            description,
            year,
            copyright,
            allowListHosts,
            apiUrl,
            socketUrl,
            apiPort,
            socketPort,
            mongooseUrl,
            defaultMaxPlayer,
            defaultTimeLimit,
            exitSuccess,
            exitFailure,
            appSecret,
            salt,
            metadataNetworkInterfaceUrl,
            logDays,
            corsEnabled,
            apiPrefix,
            socketPrefix,
            jwtExpiresIn,
            queueMonitor,
            queueMonitorHttpPort,
            redisPort,
            redisHost,
            redisPrefix,
            redisDB,
        };
    };

    public static Initialise = (express: Application): Application => {
        express.locals.app = this.Config();
        return express;
    };
}

export default Locals;
