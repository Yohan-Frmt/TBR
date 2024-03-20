import { OPEN, Server } from "ws";
import Log from "../Middleware/Log";
import { Lobbies } from "../Model/Lobbies";
import { TAction, TActionsKey, TMessage } from "../Type";
import { classes, config } from "./index";

const broadcast = (socketServer: Server, message: TMessage) => {
    if (!socketServer.clients) return;
    socketServer.clients.forEach((client) => {
        if (client.readyState === OPEN) {
            console.log(message);
            client.send(JSON.stringify(message));
        }
    });
};

const Users = async (
    socketServer: Server,
    message: TMessage,
    { lobby }: { lobby: string }
) => {
    Log.Info("Broadcasting user's message");
    const type = "users";
    const payload = await Lobbies.GetUsers(lobby);
    broadcast(socketServer, {
        type,
        payload,
    });
};

const actions = {
    Users,
};

const CallAction = (
    type: string,
    name: string,
    lobby: string,
    userId: string,
    message: TMessage,
    socketServer: Server
) => {
    Log.Info(`${ lobby }: ${ userId }: ${ name }`);

    // @ts-ignore
    classes[type as TActionsKey][name as keyof TAction](
        lobby,
        userId,
        (message && message.payload) || undefined
    );
    return actions[type as TActionsKey](socketServer, message, { lobby });
};

const CreateEndpointFunction =
    (type: string, name: string) =>
        (
            socketServer: Server,
            message: TMessage,
            {
                lobby,
                userId,
            }: {
                lobby: string;
                userId: string;
            }
        ) => {
            return CallAction(type, name, lobby, userId, message, socketServer);
        };

const BuildEndpoints = (config: any, type: string) =>
    Object.keys(config[type]).reduce((funcs, name: string) => {
        return {
            ...funcs,
            [name]: CreateEndpointFunction(type, name),
        };
    }, {});

const GenerateEndpoints = (config: any) =>
    Object.keys(config).reduce((functions, type: string) => {
        const newFuncs = BuildEndpoints(config, type);
        return { ...functions, ...newFuncs };
    }, {});

export const socketActions: any = GenerateEndpoints(config);
