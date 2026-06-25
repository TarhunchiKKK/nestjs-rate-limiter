import * as fs from "node:fs";
import * as path from "node:path";
import type Redis from "ioredis";
import { Executor, InjectStorage } from "../../decorators";
import type { Key } from "../../shared/keys";
import { getRedisKey } from "../../shared/redis";
import type { IExecutor } from "../executor.interface";
import type { FixedWindowOptions } from "./types";

@Executor({ strategy: "fixed-window", storage: "redis" })
export class FixedWindowRedisExecutor implements IExecutor<FixedWindowOptions> {
    private readonly luaScript: string;

    public constructor(@InjectStorage() private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/fixed-window.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: FixedWindowOptions) {
        const redisKey = getRedisKey(key);
        const keysCount = 1;

        const currentCount = (await this.redis.eval(this.luaScript, keysCount, redisKey, options.ttl.toString())) as number;

        return currentCount < options.limit;
    }
}
