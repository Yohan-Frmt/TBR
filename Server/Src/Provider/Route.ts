import { Application } from 'express';
import Log from '../Middleware/Log';
import { api, lobby, user } from "../Routes";
import Locals from './Locals';

class Route {
    public EnableApi = (express: Application): Application => {
        const apiPrefix: string = Locals.Config().apiPrefix;
        Log.Info('[Routes] Mounting API Routes...');
        return express.use(`/${ apiPrefix }`, api);
    };
    public EnableUser = (express: Application): Application => {
        const apiPrefix: string = Locals.Config().apiPrefix;
        Log.Info('[Routes] Mounting User Routes...');
        return express.use(`/${ apiPrefix }`, user);
    };
    public EnableLobby = (express: Application): Application => {
        const apiPrefix: string = Locals.Config().apiPrefix;
        Log.Info('[Routes] Mounting Lobby Routes...');
        return express.use(`/${ apiPrefix }`, lobby);
    };
}

export default new Route;
