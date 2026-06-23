export type FixedWindowStrategyName = "fixed-window";

export type FixedWindowStrategyOptions = {
    limit: number;
    ttl: number;
};

export type FixedWindowStrategyState = {
    count: number;
    resetTime: number;
};
