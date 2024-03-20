import bluebird from 'bluebird';
import { MongoError } from "mongodb";
import mongoose from 'mongoose';
import Log from '../Middleware/Log';
import Locals from "../Provider/Locals";

export class Database {
    public static Initialise(): void {
        const url: string = Locals.Config().mongooseUrl ?? "";
        mongoose.Promise = bluebird;
        mongoose
            .connect(url)
            .then((): void => {
                Log.Info(`[Database] Connected to Mongo Database at : ${ url }`);
            })
            .catch((err: MongoError): void => {
                Log.Error(`[Error] Error while connecting to Mongo Database : ${ err.message }`);
                throw err;
            });
    }
}

export default mongoose;
