export type SlidingWindowCounterOptions = {
    limit: number;
    windowMs: number;
};

export type SlidingWindowCounterState = {
    currentWindowStart: number;
    currentCount: number;
    previousCont: number;
};
