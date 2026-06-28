import type { StrategyOptionsUnion } from "../../executors";
import type { DeepPartial, FlattenOptionalNeverUnion, PartialUnionMembers } from "../../shared/lib";
import type { BaseOptions, ErrorFactoryOptions, KeyExtractorOptions, OptionsFactoryOptions, StrategyOptions } from "./common.options";

export type RateLimitOptions = Partial<BaseOptions> &
    Partial<KeyExtractorOptions> &
    Partial<ErrorFactoryOptions> &
    Partial<OptionsFactoryOptions> &
    PartialUnionMembers<StrategyOptionsUnion>;

export type RateLimitNormalizedOptions = Partial<BaseOptions> &
    FlattenOptionalNeverUnion<KeyExtractorOptions> &
    FlattenOptionalNeverUnion<ErrorFactoryOptions> &
    FlattenOptionalNeverUnion<OptionsFactoryOptions> &
    DeepPartial<StrategyOptions>;
