import * as fs from "node:fs";
import * as path from "node:path";
import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import { getRedisKey } from "../../shared/redis";
import type { IExecutor } from "../executor.interface";
import type { LeakyBucketOptions } from "./types";

@Injectable()
export class LeakyBucketRedisExecutor implements IExecutor<LeakyBucketOptions> {
    private readonly luaScript: string;

    public constructor(@Inject(REDIS_STORAGE_TOKEN) private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/leaky-bucket.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: LeakyBucketOptions) {
        const redisKey = getRedisKey(key);
        const keysCount = 1;

        const startTime = Date.now();

        const result = await this.redis.eval(
            this.luaScript,
            keysCount,
            redisKey,
            startTime.toString(),
            options.capacity.toString(),
            options.leakRate.toString(),
            options.ttl.toString()
        );

        return result === 1;
    }
}
