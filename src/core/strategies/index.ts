import type { FixedWindowStrategyOptions, FixedWindowStrategyState } from "./fixed-window/types";
import type { TokenBucketStrategyOptions, TokenBucketStrategyState } from "./token-bucket/types";

export type LimiterOptions = FixedWindowStrategyOptions | TokenBucketStrategyOptions;

export type LimiterState = FixedWindowStrategyState | TokenBucketStrategyState;

export { FixedWindowStrategy } from "./fixed-window/strategy";
export { TokenBucketStrategy } from "./token-bucket/strategy";
