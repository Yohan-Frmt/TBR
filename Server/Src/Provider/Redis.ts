import * as redis from "redis";
import { RedisClientType } from "redis";
import { promisify } from "util";
import Locals from "./Locals";

interface IRedisConfig {
    host: string;
    port: number;
    database?: number;
}

/**
 * Redis class for interacting with a Redis database.
 */
export class Redis {
    private readonly _client: RedisClientType;

    constructor({ host, port, database }: IRedisConfig) {
        this._client = redis.createClient({
            url: `redis://${ host }:${ port }`,
        });
        this._client.connect();
        this.Delete = promisify(this._client.del).bind(this._client);
    }

    public Subscribe = async (channel: string): Promise<void> => {
        await this._client.subscribe(channel, (message) => {
            return message;
        });
    };
    public Get = async <T>(key: string): Promise<T> => {
        const str = await this._client.get(key);
        return str !== null ? JSON.parse(str) : null;
    };

    public Set = <T>(key: string, value: T) =>
        this._client.set(key, JSON.stringify(value));

    public Has = async (key: string): Promise<boolean> =>
        (await this._client.get(key)) !== null;

    public Delete = async (key: string): Promise<number> =>
        await this._client.del(key);
}

export default new Redis({
    host: Locals.Config().redisHost,
    port: Locals.Config().redisPort,
});
