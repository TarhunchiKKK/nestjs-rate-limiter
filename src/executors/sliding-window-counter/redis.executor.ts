import * as fs from "node:fs";
import * as path from "node:path";
import { Inject, Injectable } from "@nestjs/common";
import type { IExecutor, StorageTypes, Strategies } from "../executor.interface";
import type { SlidingWindowCounterOptions } from "./types";
import type { Key } from "../../shared/keys";
import { REDIS_STORAGE_TOKEN } from "../../di/di.constants";
import type Redis from "ioredis";
import { getRedisKey } from "../../shared/redis";

@Injectable()
export class SlidingWindowCounterRedisExecutor implements IExecutor<SlidingWindowCounterOptions> {
    public readonly strategy: Strategies = "sliding-window-counter";
    public readonly storageType: StorageTypes = "redis";
    private readonly luaScript: string;

    public constructor(@Inject(REDIS_STORAGE_TOKEN) private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/fixed-window.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: SlidingWindowCounterOptions) {
        const redisKey = getRedisKey(key);
        const keysCount = 1;

        const result = await this.redis.eval(this.luaScript, redisKey, keysCount, Date.now().toString(), options.windowMs.toString(), options.limit.toString());

        return result === 1;
    }
}
