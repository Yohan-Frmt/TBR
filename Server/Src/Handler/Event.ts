import { Cluster, Worker } from "cluster";
import Log from "../Middleware/Log";

class Event {
    public Cluster(cluster: Cluster): void {
        cluster.on('listening', (worker: Worker) => {
            Log.Info(`[Cluster] PID '${ worker.process.pid }' Connected!`)
        });

        cluster.on('online', (worker: Worker) => {
            Log.Info(`[Cluster] PID '${ worker.process.pid }' forked!`);
        });

        cluster.on('disconnect', (worker: Worker) => {
            Log.Info(`[Cluster] PID '${ worker.process.pid }' Disconnected!`)
        });

        cluster.on('exit', (worker: Worker, code: any, signal: any): void => {
            Log.Info(`[Cluster] PID '${ worker.process.pid }' is Dead with Code '${ code }, and signal: '${ signal }'`);
            cluster.fork();
        });
    }

    public Process(): void {
        process.on('uncaughtException', (exception: Error) => {
            Log.Error(`[Error] ${ exception.stack }` || '[Error] Unknown error');
        });

        process.on('warning', (warning: Error) => {
            Log.Warn(`[Error] ${ warning.stack }` || '[Error] Unknown error');
        });
    }
}

export default new Event();
