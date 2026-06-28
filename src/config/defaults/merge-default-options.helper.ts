import type { FlattenOptionalNeverUnion } from "../../shared/lib";
import type {
    ErrorFactoryOptions,
    KeyExtractorOptions,
    ModuleOptionsFactoryOptions,
    RateLimiterModuleFullOptions,
    RateLimiterModuleOptions,
    StorageOptions
} from "../options";
import { RATE_LIMITER_MODULE_DEFAULT_OPTIONS } from "./default-options.constants";

export function mergeDefaultOptions(options: RateLimiterModuleOptions) {
    const storageOptions: StorageOptions = options.storage === "redis" ? { storage: "redis", instance: options.instance } : { storage: "in-memory" };

    let keyExtractorOptions: KeyExtractorOptions;
    if (options.keyExtractor) {
        keyExtractorOptions = { keyExtractor: options.keyExtractor, keyExtractorFn: undefined };
    } else if (options.keyExtractorFn) {
        keyExtractorOptions = { keyExtractor: undefined, keyExtractorFn: options.keyExtractorFn };
    } else {
        keyExtractorOptions = {
            keyExtractor: RATE_LIMITER_MODULE_DEFAULT_OPTIONS.keyExtractor,
            keyExtractorFn: RATE_LIMITER_MODULE_DEFAULT_OPTIONS.keyExtractorFn
        };
    }

    let errorFactoryOptions: ErrorFactoryOptions;
    if (options.errorFactory) {
        errorFactoryOptions = { errorFactory: options.errorFactory, errorFactoryFn: undefined };
    } else if (options.errorFactoryFn) {
        errorFactoryOptions = { errorFactory: undefined, errorFactoryFn: options.errorFactoryFn };
    } else {
        errorFactoryOptions = {
            errorFactory: RATE_LIMITER_MODULE_DEFAULT_OPTIONS.errorFactory,
            errorFactoryFn: RATE_LIMITER_MODULE_DEFAULT_OPTIONS.errorFactoryFn
        };
    }

    let optionsFactoryOptions: Partial<FlattenOptionalNeverUnion<ModuleOptionsFactoryOptions>>;
    if (options.optionsFactory) {
        optionsFactoryOptions = { optionsFactory: options.optionsFactory, optionsFactoryFn: undefined };
    } else if (options.optionsFactoryFn) {
        optionsFactoryOptions = { optionsFactory: undefined, optionsFactoryFn: options.optionsFactoryFn };
    } else {
        optionsFactoryOptions = {
            optionsFactory: RATE_LIMITER_MODULE_DEFAULT_OPTIONS.optionsFactory,
            optionsFactoryFn: RATE_LIMITER_MODULE_DEFAULT_OPTIONS.optionsFactoryFn
        };
    }

    return {
        scope: options.scope ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.scope,

        ...storageOptions,

        strategy: options.strategy ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategy,
        strategyOptions: {
            fixedWindow: {
                ...options.strategyOptions?.fixedWindow,
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.fixedWindow
            },
            tokenBucket: {
                ...options.strategyOptions?.tokenBucket,
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.tokenBucket
            },
            slidingWindowCounter: {
                ...options.strategyOptions?.slidingWindowCounter,
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowCounter
            },
            slidingWindowLog: {
                ...options.strategyOptions?.slidingWindowLog,
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowLog
            },
            leakyBucket: {
                ...options.strategyOptions?.leakyBucket,
                ...RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.leakyBucket
            }
        },

        ...keyExtractorOptions,
        ...errorFactoryOptions,
        ...optionsFactoryOptions,

        custom: {
            keyExtractors: options.custom?.keyExtractors ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.keyExtractors,
            errorFactories: options.custom?.errorFactories ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.errorFactories,
            optionsFactories: options.custom?.optionsFactories ?? RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.optionsFactories
        }
    } satisfies RateLimiterModuleFullOptions;
}
