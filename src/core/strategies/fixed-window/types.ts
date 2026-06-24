export type FixedWindowStrategyName = "fixed-window";

export type FixedWindowStrategyOptions = {
    strategy: "fixed-window";
    limit: number;
    ttl: number;
};

export type FixedWindowStrategyState = {
    count: number;
    resetTime: number;
};
