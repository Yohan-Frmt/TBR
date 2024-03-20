"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kue_1 = __importDefault(require("kue"));
const Log_1 = __importDefault(require("../Middleware/Log"));
const Locals_1 = __importDefault(require("./Locals"));
class Queue {
    constructor() {
        this.jobs = kue_1.default.createQueue({
            prefix: Locals_1.default.Config().redisPrefix,
            redis: {
                port: Locals_1.default.Config().redisPort,
                host: Locals_1.default.Config().redisHost,
                db: Locals_1.default.Config().redisDB,
            },
        });
        this.jobs
            .on("job enqueue", (id, type) => Log_1.default.Info(`[Queue] #${id} Processing of type '${type}'`))
            .on("job complete", (id) => this.RemoveProcessedJob(id));
    }
    Dispatch(job, args, callback) {
        this.jobs.create(job, args).save();
        this.Process(job, 3, callback);
    }
    RemoveProcessedJob(id) {
        Log_1.default.Info(`[Queue] #${id} Processed`);
        kue_1.default.Job.get(id, (err, job) => {
            if (err)
                return;
            job === null || job === void 0 ? void 0 : job.remove((err) => {
                if (err)
                    throw err;
                Log_1.default.Info(`[Queue] #${id} Removed Processed Job`);
            });
        });
    }
    Process(job, count, callback) {
        this.jobs.process(job, count, (job, done) => {
            done();
            callback(job.data);
        });
    }
}
exports.default = new Queue();
//# sourceMappingURL=Queue.js.map