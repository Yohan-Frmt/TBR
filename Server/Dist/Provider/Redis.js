"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
const redis = __importStar(require("redis"));
const util_1 = require("util");
const Locals_1 = __importDefault(require("./Locals"));
/**
 * Redis class for interacting with a Redis database.
 */
class Redis {
    constructor({ host, port, database }) {
        this.Subscribe = (channel) => __awaiter(this, void 0, void 0, function* () {
            yield this._client.subscribe(channel, (message) => {
                return message;
            });
        });
        this.Get = (key) => __awaiter(this, void 0, void 0, function* () {
            const str = yield this._client.get(key);
            return str !== null ? JSON.parse(str) : null;
        });
        this.Set = (key, value) => this._client.set(key, JSON.stringify(value));
        this.Has = (key) => __awaiter(this, void 0, void 0, function* () { return (yield this._client.get(key)) !== null; });
        this.Delete = (key) => __awaiter(this, void 0, void 0, function* () { return yield this._client.del(key); });
        this._client = redis.createClient({
            url: `redis://${host}:${port}`,
        });
        this._client.connect();
        this.Delete = (0, util_1.promisify)(this._client.del).bind(this._client);
    }
}
exports.Redis = Redis;
exports.default = new Redis({
    host: Locals_1.default.Config().redisHost,
    port: Locals_1.default.Config().redisPort,
});
//# sourceMappingURL=Redis.js.map