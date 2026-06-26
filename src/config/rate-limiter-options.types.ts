/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ExecutionContext, ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { FixedWindowOptions, LeakyBucketOptions, SlidingWindowCounterOptions, SlidingWindowLogOptions, TokenBucketOptions } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { Key } from "../shared/keys";
import type { StorageTypes, Strategies } from "../shared/types";

export type RateLimiterOptions = {
    limiter: {
        storage: StorageTypes;
        defaults: {
            strategy?: Strategies;
            scope?: string;
            error?: (context: ExecutionContext, options: RateLimiterOptions, key: Key) => Error;
        };
        options: {
            fixedWindow?: Partial<FixedWindowOptions>;
            tokenBucket?: Partial<TokenBucketOptions>;
            slidingWindowCounter?: Partial<SlidingWindowCounterOptions>;
            slidingWindowLog?: Partial<SlidingWindowLogOptions>;
            leakyBucket?: Partial<LeakyBucketOptions>;
        };
    };
    keyExtractors?: {
        default?: KeyExtractorFn | Type<IKeyExtractor>;
        custom: Provider<IKeyExtractor>[];
    };
};

export type RateLimiterAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject: any[];

    useFactory: (...args: any[]) => RateLimiterOptions | Promise<RateLimiterOptions>;
};
