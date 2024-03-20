import { NextFunction, Request, Response } from "express";
import { Lobbies } from "../Model/Lobbies";

export class Lobby {
    public static Create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> => {
        const userId = req.query.userId as string;
        const capacity: number = parseInt((req.query.capacity as string) || "-1", 10);
        const lobby: Lobby = await Lobbies.Create(capacity);
        return res.json(lobby);
    };
    public static Get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> => {
        const lobby = await Lobbies.GetLobby(req.query.lobby as string);
        if (lobby) return res.json(lobby);
        return res.status(404).send(`Lobby ${ req.query.name } not found`);
    };
}
