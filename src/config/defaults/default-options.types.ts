import type { DeepRequired } from "../../shared/ts";
import type {
    RateLimitBaseOptions,
    RateLimitErrorFactoryOptions,
    RateLimiterModuleCustomProvidersOptions,
    RateLimiterModuleStorageOptions,
    RateLimiterModuleStrategyOptions,
    RateLimitKeyExtractorOptions,
    RateLimitOptionsFactoryOptions
} from "../options";

export type DefaultOptions = RateLimiterModuleStorageOptions &
    DeepRequired<RateLimiterModuleStrategyOptions> &
    RateLimitBaseOptions &
    RateLimitKeyExtractorOptions &
    RateLimitErrorFactoryOptions &
    Partial<RateLimitOptionsFactoryOptions> &
    DeepRequired<RateLimiterModuleCustomProvidersOptions>;
