/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { RateLimitBaseOptions } from "../decorators";
import type { FixedWindowOptions, LeakyBucketOptions, SlidingWindowCounterOptions, SlidingWindowLogOptions, TokenBucketOptions } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { StorageTypes, Strategies } from "../shared/types";

export type RateLimiterOptions = {
    limiter: {
        storage: StorageTypes;
        defaults: Pick<RateLimitBaseOptions, "scope" | "error"> & {
            strategy: Strategies;
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
