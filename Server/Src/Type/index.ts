import { UserActions } from "../Actions/UserActions";

export interface IActions {
    Users: UserActions;
}

export type TUser = {
    id: string;
    name: string;
    isActive: boolean;
    isSpectating: boolean;
    isBanned: boolean;
    count: number;
};

export type TLobby = {
    name: string;
    capacity: number;
    Users: TUser[];
    isPrivate: boolean;
};

export type TAction = UserActions;
export type TActionsKey = keyof IActions;
export type TActionsFuncs = IActions[TActionsKey];
export type TActions = Record<TActionsKey, TActionsFuncs>;
export type TEvent = Record<TActionsKey, Function>;
export type TMessage = { type: string; payload: any };
