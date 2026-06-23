export type FixedWindowStrategyName = "fixed-window";

export type FixedWindowStrategyOptions = {
    strategy: FixedWindowStrategyName;
    limit: number;
    ttl: number;
};

export type FixedWindowStrategyState = {
    strategy: FixedWindowStrategyName;
    count: number;
    resetTime: number;
};
