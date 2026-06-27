import type {
    RateLimiterModuleErrorFactoryOptions,
    RateLimiterModuleKeyExtractorOptions,
    RateLimiterModuleOptions,
    RateLimiterModuleOptionsFactoryOptions
} from "../options";
import { RATE_LIMITER_MODULE_DEFAULT_OPTIONS } from "./default-options.constants";

export function mergeDefaultOptions(options: RateLimiterModuleOptions) {
    const keyExtractorOptions = {
        keyExtractor: options.keyExtractor ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.keyExtractor,
        keyExtractorFn: options.keyExtractorFn ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.keyExtractorFn
    } as RateLimiterModuleKeyExtractorOptions;

    const errorFactoryOptions = {
        errorFactory: options.errorFactory ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.errorFactory,
        errorFactoryFn: options.errorFactoryFn ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.errorFactoryFn
    } as RateLimiterModuleErrorFactoryOptions;

    const optionsFactoryOptions = {
        optionsFactory: options.optionsFactory ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.optionsFactory,
        optionsFactoryFn: options.optionsFactoryFn ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.optionsFactoryFn
    } as RateLimiterModuleOptionsFactoryOptions;

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

        ...keyExtractorOptions,
        ...errorFactoryOptions,
        ...optionsFactoryOptions,

        custom: {
            keyExtractors: options.custom?.keyExtractors ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.keyExtractors,
            errorFactories: options.custom?.errorFactories ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.errorFactories,
            optionsFactories: options.custom?.optionsFactories ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.optionsFactories
        }
    } satisfies RateLimiterModuleOptions;
}
