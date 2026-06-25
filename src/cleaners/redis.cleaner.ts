import * as fs from "node:fs";
import * as path from "node:path";
import { Logger } from "@nestjs/common";
import type Redis from "ioredis";
import { InjectStorage } from "../di";
import { getRedisKey } from "../shared/redis";
import { Cleaner } from "./cleaner.decorator";
import type { ICleaner } from "./cleaner.interface";

// TODO: implement `onApplicationBootstrap` interface
@Cleaner({ storage: "redis" })
export class RedisCleaner implements ICleaner {
    private readonly logger = new Logger(RedisCleaner.name);

    private readonly luaScript: string;

    public constructor(@InjectStorage() private readonly redis: Redis) {
        const luaScriptPath = path.join(__dirname, "../../lua/clear-rate.lua");
        this.luaScript = fs.readFileSync(luaScriptPath, "utf-8");
    }

    public async clean() {
        try {
            const keysCount = 0;
            const keysMask = getRedisKey("*");

            const deletedCount = await this.redis.eval(this.luaScript, keysCount, keysMask);

            this.logger.log(`Cleaning completed successfully (${deletedCount} keys deleted)`);
        } catch (error) {
            this.logger.error("Error via cleaning: ", error);

            // TODO: implement throw/no-throw on error logic
        }
    }
}
