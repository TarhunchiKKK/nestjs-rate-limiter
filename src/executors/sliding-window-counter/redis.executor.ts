import * as fs from "node:fs";
import * as path from "node:path";
import type Redis from "ioredis";
import { InjectStorage } from "../../di";
import type { Key } from "../../shared/keys";
import { Executor } from "../executor.decorator";
import type { IExecutor } from "../executor.interface";
import type { SlidingWindowCounterOptions } from "./types";

@Executor({ strategy: "sliding-window-counter", storage: "redis" })
export class SlidingWindowCounterRedisExecutor implements IExecutor<SlidingWindowCounterOptions> {
    private readonly luaScript: string;

    public constructor(@InjectStorage() private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/sliding-window-counter.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: SlidingWindowCounterOptions) {
        const keysCount = 1;
        const startTime = Date.now();

        const result = await this.redis.eval(this.luaScript, key, keysCount, startTime.toString(), options.windowMs.toString(), options.limit.toString());

        return result === 1;
    }
}
