import type { RateLimiterModuleOptions } from "../options";
import { RATE_LIMITER_MODULE_DEFAULT_OPTIONS } from "./default-options.constants";

// FIX: mutually exclusive types for `keyExtractor`, `errorFactory` and `factory` fields
export function mergeDefaultOptions(options: RateLimiterModuleOptions): RateLimiterModuleOptions {
    return {
        storage: options.storage ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.storage,
        scope: options.scope ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.scope,

        strategy: options.strategy ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategy,
        strategyOptions: {
            fixedWindow: options.strategyOptions?.fixedWindow ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.fixedWindow,
            tokenBucket: options.strategyOptions?.tokenBucket ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.tokenBucket,
            slidingWindowCounter: options.strategyOptions?.slidingWindowCounter ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowCounter,
            slidingWindowLog: options.strategyOptions?.slidingWindowLog ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowLog,
            leakyBucket: options.strategyOptions?.tokenBucket ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.leakyBucket
        },

        // keyExtractor: options.keyExtractor ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.keyExtractor,
        keyExtractorFn: options.keyExtractorFn ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.keyExtractorFn,
        // errorFactory: options.errorFactory ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.errorFactory,
        errorFactoryFn: options.errorFactoryFn ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.errorFactoryFn,
        // factory: options.factory ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.factory,
        optionsFactoryFn: options.optionsFactoryFn ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.optionsFactoryFn,

        custom: {
            keyExtractors: options.custom?.keyExtractors ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.keyExtractors,
            errorFactories: options.custom?.errorFactories ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.errorFactories,
            optionsFactories: options.custom?.optionsFactories ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.optionsFactories
        }
    };
}
