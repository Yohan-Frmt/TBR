import { NextFunction, Request, Response } from "express";
import { Lobbies } from "../Model/Lobbies";

export class Home {
    public static index = (req: Request, res: Response, next: NextFunction) => {
        return res.json({
            title: "Home TSR",
            lobbies: Lobbies.Lobbies,
        });
    };
}
