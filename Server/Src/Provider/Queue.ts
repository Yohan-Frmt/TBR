import kue, { DoneCallback, Job } from "kue";
import Log from "../Middleware/Log";
import Locals from "./Locals";

class Queue {
  public jobs: kue.Queue;

  constructor() {
    this.jobs = kue.createQueue({
      prefix: Locals.Config().redisPrefix,
      redis: {
        port: Locals.Config().redisPort,
        host: Locals.Config().redisHost,
        db: Locals.Config().redisDB,
      },
    });

    this.jobs
      .on("job enqueue", (id, type) =>
        Log.Info(`[Queue] #${id} Processing of type '${type}'`)
      )
      .on("job complete", (id) => this.RemoveProcessedJob(id));
  }

  public Dispatch(job: string, args: object, callback: Function): void {
    this.jobs.create(job, args).save();
    this.Process(job, 3, callback);
  }

  private RemoveProcessedJob(id: number): void {
    Log.Info(`[Queue] #${id} Processed`);

    kue.Job.get(id, (err, job): void => {
      if (err) return;
      job?.remove((err: Error): void => {
        if (err) throw err;
        Log.Info(`[Queue] #${id} Removed Processed Job`);
      });
    });
  }

  private Process(job: string, count: number, callback: Function): void {
    this.jobs.process(job, count, (job: Job, done: DoneCallback): void => {
      done();
      callback(job.data);
    });
  }
}

export default new Queue();
