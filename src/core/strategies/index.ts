import type { FixedWindowStrategyOptions, FixedWindowStrategyState } from "./fixed-window/types";

export { FixedWindowStrategy } from "./fixed-window/strategy";

export type LimiterOptions = FixedWindowStrategyOptions;

export type LimiterState = FixedWindowStrategyState;
