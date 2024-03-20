"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const Locals_1 = __importDefault(require("../Provider/Locals"));
const Log_1 = __importDefault(require("./Log"));
// const redisClient = createClient({ url: `redis://localhost:6379` })
// redisClient.connect().catch(consola.error)
// const RedisStore = new connect({
//     client: redisClient,
//     prefix: "tsr:",
// });
class Http {
    static Enable(express) {
        Log_1.default.Info(`[Middleware] Enable Http middleware...`);
        express.disable("x-powered-by");
        express.use((0, cors_1.default)());
        express.use((0, express_session_1.default)({
            resave: true,
            saveUninitialized: true,
            secret: Locals_1.default.Config().appSecret,
            cookie: {
                maxAge: 1209600000,
            },
            store: connect_mongo_1.default.create({
                mongoUrl: Locals_1.default.Config().mongooseUrl,
            }),
        }));
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
exports.default = Http;
//# sourceMappingURL=Http.js.map