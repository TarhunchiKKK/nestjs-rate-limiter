import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import { getRedisKey } from "../../shared/redis";
import type { IExecutor, StorageTypes, Strategies } from "../executor.interface";
import type { FixedWindowOptions } from "./types";

const LUA_SCRIPT = `
local current = redis.call('incr', KEYS[1])
if current == 1 then
  redis.call('pexpire', KEYS[1], ARGV[1])
end
return current
`;

@Injectable()
export class FixedWindowRedisExecutor implements IExecutor<FixedWindowOptions> {
    public readonly strategy: Strategies = "fixed-window";
    public readonly storageType: StorageTypes = "redis";

    public constructor(@Inject(REDIS_STORAGE_TOKEN) private readonly redis: Redis) {}

    public async check(key: Key, options: FixedWindowOptions) {
        const redisKey = getRedisKey(key);

        const currentCount = (await this.redis.eval(LUA_SCRIPT, 1, redisKey, options.ttl)) as number;

        return currentCount < options.limit;
    }
}
