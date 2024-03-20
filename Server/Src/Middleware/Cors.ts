import cors from 'cors';
import { Application } from "express";
import Locals from "../Provider/Locals";
import Log from "./Log";

class Cors {
    public Enable(express: Application): Application {
        Log.Info(`[Middleware] Enable Cors middleware...`);
        const options = {
            origin: Locals.Config().allowListHosts || Locals.Config().apiUrl,
            optionsSuccessStatus: 200
        };
        express.use(cors(options));
        return express;
    }
}

export default new Cors;
