import type { BaseOptions, ProvidersOptions, StrategyOptions } from "./common.options";

export type RateLimitGuardOptions = BaseOptions & StrategyOptions & ProvidersOptions;
