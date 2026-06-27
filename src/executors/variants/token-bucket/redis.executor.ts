import * as fs from "node:fs";
import * as path from "node:path";
import type Redis from "ioredis";
import { InjectStorage } from "../../../di";
import type { Key } from "../../../shared/keys";
import { Executor, type IExecutor } from "../../lib";
import type { TokenBucketOptions } from "./types";

@Executor({ strategy: "token-bucket", storage: "redis" })
export class TokenBucketRedisExecutor implements IExecutor<TokenBucketOptions> {
    private readonly luaScript: string;

    public constructor(@InjectStorage() private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../../lua/token-bucket.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async check(key: Key, options: TokenBucketOptions) {
        const keysCount = 1;
        const startTime = Date.now();

        const result = await this.redis.eval(
            this.luaScript,
            keysCount,
            key,
            startTime.toString(),
            options.capacity.toString(),
            options.refillRate.toString(),
            options.ttl.toString()
        );

        return result === 1;
    }
}
