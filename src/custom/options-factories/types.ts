import type { ExecutionContext } from "@nestjs/common";
import type { RateLimitOptions } from "../../config/options";

export type OptionsFactoryFn = (context: ExecutionContext) => RateLimitOptions | Promise<RateLimitOptions>;

export interface IOptionsFactory {
    getOptions: OptionsFactoryFn;
}
