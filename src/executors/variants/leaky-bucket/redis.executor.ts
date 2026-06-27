import * as fs from "node:fs";
import * as path from "node:path";
import type Redis from "ioredis";
import { InjectStorage } from "../../../di";
import type { Key } from "../../../shared/keys";
import { Executor, type IExecutor } from "../../lib";
import type { LeakyBucketOptions } from "./types";

@Executor({ strategy: "leaky-bucket", storage: "redis" })
export class LeakyBucketRedisExecutor implements IExecutor<LeakyBucketOptions> {
    private readonly luaScript: string;

    public constructor(@InjectStorage() private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/leaky-bucket.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: LeakyBucketOptions) {
        const keysCount = 1;

        const startTime = Date.now();

        const result = await this.redis.eval(
            this.luaScript,
            keysCount,
            key,
            startTime.toString(),
            options.capacity.toString(),
            options.leakRate.toString(),
            options.ttl.toString()
        );

        return result === 1;
    }
}
