export type SlidingWindowCounterOptions = {
    "in-memory": {
        limit: number;
        windowMs: number;
    };
    redis: {
        limit: number;
        windowMs: number;
    };
};

export type SlidingWindowCounterState = {
    currentWindowStart: number;
    currentCount: number;
    previousCont: number;
};
