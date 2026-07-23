import type { RateLimiterModuleFullOptions, RateLimiterModuleOptions, StorageOptions } from "../options";
import { RATE_LIMITER_MODULE_DEFAULT_OPTIONS } from "./default-options.constants";

export function mergeDefaultOptions(options: RateLimiterModuleOptions) {
    const storageOptions: StorageOptions = options.storage === "redis" ? { storage: "redis", instance: options.instance } : { storage: "in-memory" };

    return {
        scope: options.scope ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.scope,

        ...storageOptions,

        strategy: options.strategy ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategy,
        strategyOptions: {
            fixedWindow: {
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.fixedWindow,
                ...options.strategyOptions?.fixedWindow
            },
            tokenBucket: {
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.tokenBucket,
                ...options.strategyOptions?.tokenBucket
            },
            slidingWindowCounter: {
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowCounter,
                ...options.strategyOptions?.slidingWindowCounter
            },
            slidingWindowLog: {
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowLog,
                ...options.strategyOptions?.slidingWindowLog
            },
            leakyBucket: {
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.leakyBucket,
                ...options.strategyOptions?.leakyBucket
            }
        },

        defaultProviders: {
            keyExtractor: options?.defaultProviders?.keyExtractor ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS?.defaultProviders?.keyExtractor,
            errorFactory: options?.defaultProviders?.errorFactory ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS?.defaultProviders?.errorFactory,
            optionsFactory: options?.defaultProviders?.optionsFactory ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS?.defaultProviders?.optionsFactory
        }
    } satisfies RateLimiterModuleFullOptions;
}
