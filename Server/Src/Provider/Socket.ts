import * as Buffer from "buffer";
import cluster from "cluster";
import consola from "consola";
import { Application, Request } from "express";
import http from "http";
import { Duplex } from "stream";
import { clearInterval } from "timers";
import WebSocket from "ws";
import { socketActions } from "../Actions/SocketActions";
import { UserActions } from "../Actions/UserActions";
import Log from "../Middleware/Log";
import { Lobbies } from "../Model/Lobbies";
import { TActions } from "../Type";
import Locals from "./Locals";

interface IExtendedWebsocket extends WebSocket {
    isAlive: boolean;
    userId: string;
}

interface IExtendedWebsocketServer<T extends WebSocket = WebSocket> extends WebSocket.Server<T> {
    interval?: NodeJS.Timer;
}

class LobbyStore {
}

class Socket {
    public OpenedSockets: Record<string, WebSocket.Server> = {};
    public Actions: TActions = {
        Users: UserActions,
    };

    private IsValidJson = (input: any): boolean => {
        try {
            const stringValue: string = typeof input !== "string" ? JSON.stringify(input) : input;
            const jsonObject = JSON.parse(stringValue);
            return typeof jsonObject === "object" && jsonObject !== null;
        } catch {
            return false;
        }
    };

    private getRequestParams(url: string): Map<string, string> {
        return url
            .split("?")[1]
            ?.split("&")
            .reduce((params, param) => {
                const [key, value] = param.split("=");
                params.set(key, value);
                return params;
            }, new Map<string, string>()) || new Map<string, string>();
    }

    private GetRequestParams = (url: string): Map<string, string> =>
        url
            .split("?")[1]
            ?.split("&")
            .reduce((params, param) => {
                const [key, value] = param.split("=");
                params.set(key, value);
                return params;
            }, new Map<string, string>()) || new Map<string, string>();

    private CreateSocket(lobby: string) {
        Log.Info(`Opening socket server for ${ lobby }`);
        const socketServer: IExtendedWebsocketServer<IExtendedWebsocket> = new WebSocket.Server({
            noServer: true,
        });
        socketServer.on("connection", (socket, request): void => {
            console.log(socketActions);
            const userId: string = this.GetRequestParams(request.url as string).get("userId") ?? "";
            socketActions.Join(socketServer, null, {
                lobby,
                userId,
            });

            socket.userId = userId;
            socket.isAlive = true;
            socket.on("pong", () => {
                Log.Info(`User with id ${ userId } ponged lobby ${ lobby }.`);
                socket.isAlive = true;
            });

            socket.on("close", () => {
                Log.Info(`User with id ${ userId } left lobby ${ lobby }.`);
                socketActions.Leave(socket, null, { lobby, userId });
            });
            -socket.on("message", (rawData) => {
                if (this.IsValidJson(rawData)) {
                    const message = JSON.parse(rawData.toString());
                    if (message.type && message.type in socketActions) {
                        Log.Info(
                            `Sending socket message associated with type "${ message.type }"`
                        );
                        socketActions[message.type](socketServer, message, {
                            lobby,
                            userId,
                        });
                    } else {
                        Log.Error(`"${ message.type }" is not a valid socket message type.`);
                    }
                } else {
                    Log.Error(`${ rawData } is not valid JSON.`);
                }
            });
        });

        let inactivePings = 0;

        socketServer.interval = setInterval(() => {
            Log.Custom("Debug", `Pinging clients of lobby ${ lobby }...`);
            let hasActive = false;
            socketServer.clients.forEach((socket) => {
                if (!socket.isAlive) {
                    Log.Info(
                        `User with id ${ socket.userId } dropped from lobby ${ lobby }.`
                    );
                    return socket.terminate();
                }
                hasActive = true;
                socket.isAlive = false;
                return socket.ping(() => {
                });
            });
            if (hasActive) {
                inactivePings = 0;
            } else {
                Log.Info(`Lobby ${ lobby } has no active users.`);
                inactivePings += 1;
            }
            if (inactivePings >= 2) {
                Log.Info(`Lobby ${ lobby } has had no active users for too long.`);
                socketServer.close();
            }
        }, 1000);

        socketServer
            .on("close", async () => {
                Log.Info(`Closing WebSocket server and deleting lobby ${ lobby }.`);
                socketServer.clients.forEach((socket) => socket.terminate());
                await Lobbies.Delete(lobby);
                delete this.OpenedSockets[lobby];
                return clearInterval(socketServer.interval);
            })
            .on("error", (err: Error) =>
                consola.error("\x1b[31m%s\x1b[0m", `[Error] ${ err.message }`)
            );

        return socketServer;
    }

    private OnUpgrade = (
        request: Request,
        socket: Duplex,
        head: Buffer
    ): void => {
        const lobby = this.GetRequestParams(request.url).get("lobby");
        if (lobby === undefined) {
            Log.Error("Lobby must be provided");
            return;
        }

        if (!Lobbies.GetLobby(lobby)) {
            socket.on("error", (err: any) => Log.Error(err));
            socket.destroy(Error(`Lobby ${ lobby } not found`));
            return;
        }

        if (!this.OpenedSockets[lobby]) {
            this.OpenedSockets[lobby] = this.CreateSocket(lobby);
            Log.Info(`Created socket for Lobby ${ lobby }`);
        } else {
            Log.Info(`Using socket for Lobby ${ lobby }`);
        }

        const currentSocket = this.OpenedSockets[lobby];

        currentSocket.handleUpgrade(
            request,
            socket,
            head,
            (ws: WebSocket): void => {
                currentSocket.emit("connection", ws, request);
            }
        );
    };

    public Initialise = (express: Application): void => {
        const socketPort: number = Locals.Config().socketPort;
        const httpServer = http.createServer(express);
        if (cluster.worker?.id == 1) {
            httpServer.listen(socketPort);
            Log.Info(`[Server] Server running with PID '${ process.pid }' Connected!`);
        }
        httpServer.on("upgrade", this.OnUpgrade);
        Log.Info(`[WebSocket] Upgrade server running with PID '${ cluster.worker?.process.pid }' Connected!`);
    };
}

export default new Socket();
