import type { StrategyOptionsUnion } from "../../executors";
import type { OptionalNeverToNullUnion } from "../../shared/ts";
import type { RateLimitBaseOptions, RateLimitErrorFactoryOptions, RateLimitKeyExtractorOptions, RateLimitOptionsFactoryOptions } from "./rate-limit.options";

export type RateLimitNormalizedBaseOptions = RateLimitBaseOptions;

export type RateLimitNormalizedKeyExtractorOptions = OptionalNeverToNullUnion<Required<RateLimitKeyExtractorOptions>>;

export type RateLimitNormalizedErrorFactoryOptions = OptionalNeverToNullUnion<Required<RateLimitErrorFactoryOptions>>;

export type RateLimitNormalizedOptionsFactoryOptions = OptionalNeverToNullUnion<Required<RateLimitOptionsFactoryOptions>>;

export type RateLimitNormalizedStrategyOptions = StrategyOptionsUnion;

export type RateLimitNormalizedOptions = RateLimitNormalizedBaseOptions &
    RateLimitNormalizedKeyExtractorOptions &
    RateLimitNormalizedErrorFactoryOptions &
    RateLimitNormalizedOptionsFactoryOptions &
    RateLimitNormalizedStrategyOptions;
