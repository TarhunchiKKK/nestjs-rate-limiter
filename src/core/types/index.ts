import type { FixedWindowStrategyName, FixedWindowStrategyOptions, FixedWindowStrategyState } from "./fixed-window.types";

export type StrategyNames = FixedWindowStrategyName;

export type LimiterOptions = FixedWindowStrategyOptions;

export type LimiterOptionsMap = {
    "fixed-window": FixedWindowStrategyOptions;
};

export type LimiterState = FixedWindowStrategyState;

export type LimiterStatesMap = {
    "fixed-window": FixedWindowStrategyState;
};
