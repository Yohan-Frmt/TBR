import { NextFunction, Request, Response } from "express";
import { Users } from "../Model/User";

export class User {
    public static Create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> => {
        const user = await Users.Create();
        return res.json(user);
    };
    public static Get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> => {
        const user: User | undefined = await Users.GetUser(
            req.query.userId as string
        );
        if (user) return res.json(user);
        return res.status(404).send(`User ${ req.query.userId } not found`);
    };
}
