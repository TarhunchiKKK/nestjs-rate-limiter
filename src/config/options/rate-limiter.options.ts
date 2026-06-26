import type { ModuleMetadata } from "@nestjs/common";
import type { ExecutorOptions } from "./executor.options";
import type { KeyExtractorOptions } from "./key-extractors.options";

export type RateLimiterOptions = {
    limiter: ExecutorOptions;

    keyExtractors?: KeyExtractorOptions;
};

export type RateLimiterAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject: any[];

    useFactory: (...args: any[]) => RateLimiterOptions | Promise<RateLimiterOptions>;
};
