import * as dotenv from "dotenv";
import kue from "kue";
import * as path from "path";
import { Database } from "../Config/Database";
import Log from "../Middleware/Log";
import Express from "./Express";
import Locals from "./Locals";

class Application {
    public ClearConsole(): void {
        process.stdout.write("\x1B[2J\x1B[0f");
    }

    public LoadConfiguration(): void {
        Log.Info("[Configuration] Loading...");
        dotenv.config({ path: path.join(__dirname, "../../.env") });
    }

    public LoadExpressServer(): void {
        Log.Info("[Server] Loading...");
        Express.Initialise();
    }

    public LoadDatabase(): void {
        Log.Info("[Database] Loading...");
        Database.Initialise();
    }

    public LoadWorker(): void {
        Log.Info("[Worker] Loading...");
    }

    public LoadQueue(): void {
        const isQueueMonitorEnabled: boolean = Locals.Config().queueMonitor;
        const queueMonitorPort: number = Locals.Config().queueMonitorHttpPort;

        if (isQueueMonitorEnabled) {
            kue.app.listen(queueMonitorPort);
            Log.Info(
                `[Queue Monitor] Running @ 'http://127.0.0.1:${ queueMonitorPort }'`
            );
        }
    }
}

export default new Application();
