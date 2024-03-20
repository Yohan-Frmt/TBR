import consola from "consola";
import express, { Application } from "express";
import { Exception } from "../Handler/Exception";
import Middleware from "../Middleware/Middleware";
import Locals from "./Locals";
import Route from "./Route";
import Socket from "./Socket";

class Express {
    public server: Application;

    constructor() {
        this.server = express();
        this.EnableSocket();
        this.EnableDotEnv();
        this.EnableMiddlewares();
        this.EnableRoutes();
    }

    private EnableDotEnv = (): void => {
        this.server = Locals.Initialise(this.server);
    };

    private EnableSocket = (): void => {
        Socket.Initialise(this.server);
    };

    private EnableMiddlewares = (): void => {
        this.server = Middleware.Initialise(this.server);
    };

    private EnableRoutes = (): void => {
        this.server = Route.EnableApi(this.server);
        this.server = Route.EnableUser(this.server);
        this.server = Route.EnableLobby(this.server);
    };

    public Initialise = () => {
        const apiPort: number = Locals.Config().apiPort;

        this.server.use(Exception.LogErrors);
        this.server.use(Exception.ClientErrorHandler);
        this.server.use(Exception.ErrorHandler);
        this.server = Exception.NotFoundHandler(this.server);

        this.server
            .listen(apiPort, () =>
                consola.info(
                    "\x1b[36m%s\x1b[0m",
                    `[Server] Running on 'http://127.0.0.1:${ apiPort }'`
                )
            )
            .on("error", (err: Error) =>
                consola.error("\x1b[31m%s\x1b[0m", `[Error] ${ err.message }`)
            );
    };
}

export default new Express();
