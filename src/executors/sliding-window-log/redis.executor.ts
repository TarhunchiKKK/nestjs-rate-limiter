import * as fs from "node:fs";
import * as path from "node:path";
import type Redis from "ioredis";
import { InjectStorage } from "../../di";
import type { Key } from "../../shared/keys";
import { getRedisKey } from "../../shared/redis";
import { generateSalt } from "../../shared/salt";
import { Executor } from "../executor.decorator";
import type { IExecutor } from "../executor.interface";
import type { SlidingWindowLogOptions } from "./types";

@Executor({ strategy: "sliding-window-log", storage: "redis" })
export class SlidingWindowLogRedisExecutor implements IExecutor<SlidingWindowLogOptions> {
    private readonly luaScript: string;

    public constructor(@InjectStorage() private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/sliding-window-log.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: SlidingWindowLogOptions) {
        const redisKey = getRedisKey(key);
        const keysCount = 1;

        const startTime = Date.now();
        const salt = generateSalt();

        const result = await this.redis.eval(
            this.luaScript,
            keysCount,
            redisKey,
            startTime.toString(),
            options.windowMs.toString(),
            options.limit.toString(),
            salt
        );

        return result === 1;
    }
}
