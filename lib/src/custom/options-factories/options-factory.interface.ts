import type { ExecutionContext } from "@nestjs/common";
import type { RateLimitOptions } from "../../config/options";

export interface IOptionsFactory {
    getOptions: (context: ExecutionContext) => RateLimitOptions | Promise<RateLimitOptions>;
}
