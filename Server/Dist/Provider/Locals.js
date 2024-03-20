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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const process = __importStar(require("process"));
class Locals {
}
_a = Locals;
Locals.Config = () => {
    var _b, _c;
    dotenv.config({ path: path.join(__dirname, "../../.env") });
    const nodeEnv = process.env.NODE_ENV || "development";
    const name = process.env.APP_NAME || "NodeTS Dashboard";
    const description = process.env.APP_DESCRIPTION || "Here goes the app description";
    const year = new Date().getFullYear();
    const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
    const allowListHosts = nodeEnv === "development"
        ? (_b = process.env.ALLOW_LIST_HOSTS_DEV) === null || _b === void 0 ? void 0 : _b.split(",")
        : (_c = process.env.ALLOW_LIST_HOSTS_PROD) === null || _c === void 0 ? void 0 : _c.split(",");
    const apiUrl = process.env.API_URL || `http://localhost:${process.env.API_PORT}`;
    const socketUrl = process.env.SOCKET_URL || `ws://localhost:${process.env.SOCKET_PORT}`;
    const apiPort = Number(process.env.API_PORT) || 8080;
    const socketPort = Number(process.env.SOCKET_PORT) || 80;
    // const mongooseUrl: string = process.env.MONGOOSE_URL || "NO URL FOUND";
    const mongooseUrl = nodeEnv === "development"
        ? process.env.MONGOOSE_URL_LOCAL
        : process.env.MONGOOSE_URL;
    const defaultMaxPlayer = Number(process.env.DEFAULT_MAX_PLAYERS);
    const defaultTimeLimit = Number(process.env.DEFAULT_TIME_LIMIT);
    const exitSuccess = Number(process.env.EXIT_SUCCESS);
    const exitFailure = Number(process.env.EXIT_FAILURE);
    const appSecret = process.env.APP_SECRET || "CHANGE IT!";
    const salt = Number(process.env.SALT);
    const metadataNetworkInterfaceUrl = process.env.METADATA_NETWORK_INTERFACE_URL || "CHANGE IT!";
    const logDays = Number(process.env.LOG_DAYS) || 10;
    const corsEnabled = Boolean(process.env.CORS_ENABLED) || true;
    const apiPrefix = process.env.API_PREFIX || "api";
    const socketPrefix = process.env.SOCKET_PREFIX || "socket.io";
    const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN) || 2;
    const queueMonitor = Boolean(process.env.QUEUE_HTTP_ENABLED) || true;
    const queueMonitorHttpPort = Number(process.env.QUEUE_HTTP_PORT) || 5550;
    const redisPort = Number(process.env.REDIS_PORT) || 6379;
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPrefix = process.env.REDIS_QUEUE_DB || "q";
    const redisDB = Number(process.env.REDIS_QUEUE_PREFIX) || 3;
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
Locals.Initialise = (express) => {
    express.locals.app = _a.Config();
    return express;
};
exports.default = Locals;
//# sourceMappingURL=Locals.js.map