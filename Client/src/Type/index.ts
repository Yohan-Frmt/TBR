import { ReadyState } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { SocketIOMessageData } from "react-use-websocket/dist/lib/use-socket-io";
import { JsonArray, JsonObject } from "react-use-websocket/src/lib/types";

export type TUser = {
    id: string;
    name: string;
    present: boolean;
    spectate: boolean;
    banned: boolean;
    count: number;
};

export type TLobby = {
    name: string;
    capacity: string;
    users: TUser[];
    locked: boolean;
    game: null;
};

export type TMessages = {
    [name: string]: string | JsonObject | JsonArray;
};

export type TJsonMessage = {
    type: string;
    payload: TGamePayload | TUserPayload;
};

export type TGamePayload = {
    players: TUser[];
    currentPlayerId: string;
    game: any /*Game*/;
    isOver: boolean;
    winners: TUser[] /*Team*/;
};

export type TUserPayload = {
    players: TUser[];
    inactives: TUser[];
    spectators: TUser[];
    banned: TUser[];
};

export type TSocketContext = {
    error: string | null;
    lastJsonMessage: SocketIOMessageData | null;
    lastMessages: TMessages;
    readyState: ReadyState;
    lobby: string;
    sendJsonMessage: SendJsonMessage | null;
};

export type TUserContext = {
    userId: string;
    user: TUser | null;
    setUsername: Function;
};

export type TBoolean = boolean | "" | null;
