import type { DeepRequired } from "../../shared/ts";
import type {
    RateLimiterModuleBaseOptions,
    RateLimiterModuleCustomProvidersOptions,
    RateLimiterModuleErrorFactoryOptions,
    RateLimiterModuleKeyExtractorOptions,
    RateLimiterModuleOptionsFactoryOptions,
    RateLimiterModuleStrategyOptions
} from "../options";

export type DefaultOptions = RateLimiterModuleBaseOptions &
    DeepRequired<RateLimiterModuleStrategyOptions> &
    RateLimiterModuleKeyExtractorOptions &
    RateLimiterModuleErrorFactoryOptions &
    Partial<RateLimiterModuleOptionsFactoryOptions> &
    DeepRequired<RateLimiterModuleCustomProvidersOptions>;
