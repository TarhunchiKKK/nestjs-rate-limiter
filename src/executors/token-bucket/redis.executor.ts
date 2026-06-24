import * as fs from "node:fs";
import * as path from "node:path";
import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import { getRedisKey } from "../../shared/redis";
import type { IExecutor, StorageTypes, Strategies } from "../executor.interface";
import type { TokenBucketOptions } from "./types";

@Injectable()
export class TokenBucketRedisExecutor implements IExecutor<TokenBucketOptions> {
    public readonly strategy: Strategies = "token-bucket";
    public readonly storageType: StorageTypes = "redis";
    private readonly luaScript: string;

    public constructor(@Inject(REDIS_STORAGE_TOKEN) private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/fixed-window.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: TokenBucketOptions) {
        const redisKey = getRedisKey(key);
        const keysCount = 1;

        const result = await this.redis.eval(
            this.luaScript,
            keysCount,
            redisKey,
            Date.now().toString(),
            options.capacity.toString(),
            options.refillRate.toString(),
            options.ttl.toString()
        );

        return result === 1;
    }
}
