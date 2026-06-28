import type { BaseOptions, ErrorFactoryOptions, KeyExtractorOptions, OptionsFactoryOptions, StrategyOptions } from "./common.options";

export type RateLimitGuardOptions = BaseOptions & StrategyOptions & KeyExtractorOptions & ErrorFactoryOptions & OptionsFactoryOptions;
