import * as fs from "node:fs";
import * as path from "node:path";
import { Inject } from "@nestjs/common";
import type Redis from "ioredis";
import { Executor } from "../../decorators";
import { REDIS_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import { getRedisKey } from "../../shared/redis";
import type { IExecutor } from "../executor.interface";
import type { SlidingWindowCounterOptions } from "./types";

@Executor({ strategy: "sliding-window-counter", storage: "redis" })
export class SlidingWindowCounterRedisExecutor implements IExecutor<SlidingWindowCounterOptions> {
    private readonly luaScript: string;

    public constructor(@Inject(REDIS_STORAGE_TOKEN) private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/sliding-window-counter.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: SlidingWindowCounterOptions) {
        const redisKey = getRedisKey(key);
        const keysCount = 1;
        const startTime = Date.now();

        const result = await this.redis.eval(this.luaScript, redisKey, keysCount, startTime.toString(), options.windowMs.toString(), options.limit.toString());

        return result === 1;
    }
}
