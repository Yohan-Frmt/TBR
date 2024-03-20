"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const consola_1 = __importDefault(require("consola"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const SocketActions_1 = require("../Actions/SocketActions");
const UserActions_1 = require("../Actions/UserActions");
const Log_1 = __importDefault(require("../Middleware/Log"));
const Lobby_1 = require("../Model/Lobby");
const Locals_1 = __importDefault(require("./Locals"));
class Websocket {
    constructor() {
        this.OpenedSockets = {};
        this.Actions = {
            Users: UserActions_1.UserActions,
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
                Log_1.default.Error("Room must be provided");
                return;
            }
            if (!Lobby_1.Lobbies.GetLobby(lobby)) {
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
            const socketPort = Locals_1.default.Config().socketPort;
            if (cluster_1.default.isPrimary) {
                Log_1.default.Info(`[Websocket] Enable Primary WebSocket Server...`);
                const httpServer = http_1.default.createServer(express);
                cluster_1.default.setupPrimary({
                    // @ts-ignore
                    serialization: "advanced",
                });
                httpServer.listen(socketPort);
                httpServer.on("upgrade", this.OnUpgrade);
                // } else {
                // Log.Info(`[Websocket] Enable Worker WebSocket Server...`);
                // const httpServer = http.createServer(express);
                // httpServer.on("upgrade", this.OnUpgrade);
            }
        };
        this.Clients = {};
        this.Rooms = [];
    }
    CreateSocket(room) {
        Log_1.default.Info(`Opening socket server for ${room}`);
        const socketServer = new ws_1.Server({ noServer: true });
        socketServer.on("connection", (socket, message) => {
            var _a;
            const userId = (_a = this.GetRequestParams(socket.url).get("userId")) !== null && _a !== void 0 ? _a : undefined;
            SocketActions_1.socketActions.Join(socketServer, null, {
                room,
                userId,
            });
            socket.userId = userId;
            socket.isAlive = true;
            socket.on("pong", () => {
                Log_1.default.Info(`User with id ${userId} ponged room ${room}.`);
                socket.isAlive = true;
            });
            /** When the websocket connection closes, the user has left the room. */
            socket.on("close", () => {
                logger.info(`User with id ${userId} left room ${room}.`);
                SocketActions_1.socketActions.disconnect(socket, null, { room, userId });
            });
            socket.on("message", (data) => {
                if (isJSON(data)) {
                    const message = JSON.parse(data.toString());
                    if (message.type && message.type in SocketActions_1.socketActions) {
                        Log_1.default.Info(`Sending socket message associated with type "${message.type}"`);
                        SocketActions_1.socketActions[message.type](wss, message, { room, userId });
                    }
                    else {
                        Log_1.default.Error(`"${message.type}" is not a valid socket message type.`);
                    }
                }
                else {
                    Log_1.default.Error(`${data} is not valid JSON.`);
                }
            });
        });
        let inactivePings = 0;
        /** Set a pinging interval for each client to ensure they're still connected. */
        wss.interval = setInterval(() => {
            logger.debug(`Pinging clients of room ${name}...`);
            let hasActive = false;
            wss.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    logger.info(`User with id ${ws.userId} dropped from room ${name}.`);
                    return ws.terminate();
                }
                hasActive = true;
                ws.isAlive = false;
                return ws.ping(() => { });
            });
            if (hasActive) {
                inactivePings = 0;
            }
            else {
                logger.info(`Room ${name} has no active users.`);
                inactivePings += 1;
            }
            if (inactivePings >= MAX_INACTIVE_PINGS) {
                logger.info(`Room ${name} has had no active users for too long.`);
                wss.close();
            }
        }, PING_INTERVAL);
        /** Delete the room when the websocket server is closed entirely. */
        wss
            .on("close", () => {
            logger.info(`Closing WebSocket server and deleting room ${name}.`);
            wss.clients.forEach((ws) => ws.terminate());
            Rooms.deleteRoom(name);
            delete socketServers[name];
            return clearInterval(wss.interval);
        })
            // .on("listening", () => {
            //   consola.info(
            //     "\x1b[36m%s\x1b[0m",
            //     `[Socket] Running on 'http://127.0.0.1:${socketPort}'`
            //   );
            // })
            .on("error", (err) => consola_1.default.error("\x1b[31m%s\x1b[0m", `[Error] ${err.message}`));
        return socketServer;
    }
}
exports.default = new Websocket();
//# sourceMappingURL=Websocket.js.map