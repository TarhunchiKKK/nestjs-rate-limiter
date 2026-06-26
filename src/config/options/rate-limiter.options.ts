import type { ModuleMetadata } from "@nestjs/common";
import type { CustomProvidersOptions } from "./custom-providers.options";
import type { ExecutorOptions } from "./executor.options";
import type { KeyExtractorOptions } from "./key-extractors.options";

export type RateLimiterOptions = {
    limiter: ExecutorOptions;

    keyExtractor?: KeyExtractorOptions;

    custom?: CustomProvidersOptions;
};

export type RateLimiterAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject: any[];

    useFactory: (...args: any[]) => RateLimiterOptions | Promise<RateLimiterOptions>;
};
