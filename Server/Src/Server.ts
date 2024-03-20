import cluster from "cluster";
import * as os from "node:os";
import Event from "./Handler/Event";
import Application from "./Provider/Application";

if (cluster.isPrimary) {
    Event.Process();
    Application.ClearConsole();
    Application.LoadConfiguration();
    const CPUS: os.CpuInfo[] = os.cpus();
    CPUS.forEach(() => cluster.fork());
    Event.Cluster(cluster);
    Application.LoadQueue();
    setTimeout(() => Application.LoadWorker(), 1000 * 60);
} else {
    Application.LoadDatabase();
    Application.LoadExpressServer();
}
