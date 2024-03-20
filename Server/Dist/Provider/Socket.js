"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const consola_1 = __importDefault(require("consola"));
const http_1 = __importDefault(require("http"));
const timers_1 = require("timers");
const ws_1 = __importDefault(require("ws"));
const SocketActions_1 = require("../Actions/SocketActions");
const UserActions_1 = require("../Actions/UserActions");
const Log_1 = __importDefault(require("../Middleware/Log"));
const Lobbies_1 = require("../Model/Lobbies");
const Locals_1 = __importDefault(require("./Locals"));
class LobbyStore {
}
class Socket {
    constructor() {
        this.OpenedSockets = {};
        this.Actions = {
            Users: UserActions_1.UserActions,
        };
        this.IsValidJson = (input) => {
            try {
                const stringValue = typeof input !== "string" ? JSON.stringify(input) : input;
                const jsonObject = JSON.parse(stringValue);
                return typeof jsonObject === "object" && jsonObject !== null;
            }
            catch (_a) {
                return false;
            }
        };
        this.GetRequestParams = (url) => {
            return url
                .split("?")[1]
                .split("&")
                .reduce((p, c) => {
                let components = c.split("=");
                p.set(components[0], components[1]);
                return p;
            }, new Map());
        };
        // private OnUpgrade = (
        //     httpServer: http.Server,
        //     socketServer: Server
        // ): void => {
        this.OnUpgrade = (request, socket, head) => {
            const lobby = this.GetRequestParams(request.url).get("lobby");
            if (lobby === undefined) {
                Log_1.default.Error("Lobby must be provided");
                return;
            }
            if (!Lobbies_1.Lobbies.GetLobby(lobby)) {
                socket.on("error", (err) => Log_1.default.Error(err));
                socket.destroy(Error(`Lobby ${lobby} not found`));
                return;
            }
            if (!this.OpenedSockets[lobby]) {
                this.OpenedSockets[lobby] = this.CreateSocket(lobby);
                Log_1.default.Info(`Created socket for Lobby ${lobby}`);
            }
            else {
                Log_1.default.Info(`Using socket for Lobby ${lobby}`);
            }
            const currentSocket = this.OpenedSockets[lobby];
            currentSocket.handleUpgrade(request, socket, head, (ws) => {
                currentSocket.emit("connection", ws, request);
            });
        };
        this.Initialise = (express) => {
            var _a;
            const socketPort = Locals_1.default.Config().socketPort;
            const httpServer = http_1.default.createServer(express);
            // if (cluster.worker?.id == 1) {
            httpServer.listen(socketPort);
            Log_1.default.Info(`[Server] Server running with PID '${process.pid}' Connected!`);
            // }
            httpServer.on("upgrade", this.OnUpgrade);
            Log_1.default.Info(`[WebSocket] Upgrade server running with PID '${(_a = cluster_1.default.worker) === null || _a === void 0 ? void 0 : _a.process.pid}' Connected!`);
        };
    }
    CreateSocket(lobby) {
        Log_1.default.Info(`Opening socket server for ${lobby}`);
        const socketServer = new ws_1.default.Server({
            noServer: true,
        });
        socketServer.on("connection", (socket, request) => {
            var _a;
            console.log(SocketActions_1.socketActions);
            const userId = (_a = this.GetRequestParams(request.url).get("userId")) !== null && _a !== void 0 ? _a : "";
            SocketActions_1.socketActions.Join(socketServer, null, {
                lobby,
                userId,
            });
            socket.userId = userId;
            socket.isAlive = true;
            socket.on("pong", () => {
                Log_1.default.Info(`User with id ${userId} ponged lobby ${lobby}.`);
                socket.isAlive = true;
            });
            socket.on("close", () => {
                Log_1.default.Info(`User with id ${userId} left lobby ${lobby}.`);
                SocketActions_1.socketActions.Leave(socket, null, { lobby, userId });
            });
            -socket.on("message", (rawData) => {
                if (this.IsValidJson(rawData)) {
                    const message = JSON.parse(rawData.toString());
                    if (message.type && message.type in SocketActions_1.socketActions) {
                        Log_1.default.Info(`Sending socket message associated with type "${message.type}"`);
                        SocketActions_1.socketActions[message.type](socketServer, message, {
                            lobby,
                            userId,
                        });
                    }
                    else {
                        Log_1.default.Error(`"${message.type}" is not a valid socket message type.`);
                    }
                }
                else {
                    Log_1.default.Error(`${rawData} is not valid JSON.`);
                }
            });
        });
        let inactivePings = 0;
        socketServer.interval = setInterval(() => {
            Log_1.default.Custom("Debug", `Pinging clients of lobby ${lobby}...`);
            let hasActive = false;
            socketServer.clients.forEach((socket) => {
                if (!socket.isAlive) {
                    Log_1.default.Info(`User with id ${socket.userId} dropped from lobby ${lobby}.`);
                    return socket.terminate();
                }
                hasActive = true;
                socket.isAlive = false;
                return socket.ping(() => {
                });
            });
            if (hasActive) {
                inactivePings = 0;
            }
            else {
                Log_1.default.Info(`Lobby ${lobby} has no active users.`);
                inactivePings += 1;
            }
            if (inactivePings >= 2) {
                Log_1.default.Info(`Lobby ${lobby} has had no active users for too long.`);
                socketServer.close();
            }
        }, 1000);
        socketServer
            .on("close", () => __awaiter(this, void 0, void 0, function* () {
            Log_1.default.Info(`Closing WebSocket server and deleting lobby ${lobby}.`);
            socketServer.clients.forEach((socket) => socket.terminate());
            yield Lobbies_1.Lobbies.Delete(lobby);
            delete this.OpenedSockets[lobby];
            return (0, timers_1.clearInterval)(socketServer.interval);
        }))
            .on("error", (err) => consola_1.default.error("\x1b[31m%s\x1b[0m", `[Error] ${err.message}`));
        return socketServer;
    }
}
exports.default = new Socket();
//# sourceMappingURL=Socket.js.map