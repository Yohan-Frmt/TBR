import MongoStore from "connect-mongo";
import cors from "cors";
import { Application } from "express";
import session from "express-session";
import Locals from "../Provider/Locals";
import Log from "./Log";

// const redisClient = createClient({ url: `redis://localhost:6379` })
// redisClient.connect().catch(consola.error)
// const RedisStore = new connect({
//     client: redisClient,
//     prefix: "tsr:",
// });

class Http {
  public static Enable(express: Application): Application {
    Log.Info(`[Middleware] Enable Http middleware...`);
    express.disable("x-powered-by");
    express.use(cors());
    express.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: Locals.Config().appSecret,
        cookie: {
          maxAge: 1209600000,
        },
        store: MongoStore.create({
          mongoUrl: Locals.Config().mongooseUrl,
        }),
      })
    );
    // express.use(session({
    //     store: RedisStore,
    //     resave: true,
    //     saveUninitialized: false,
    //     secret: Locals.Config().appSecret,
    //     cookie: {
    //         maxAge: 1209600000
    //     },
    // }));
    return express;
  }
}

export default Http;
