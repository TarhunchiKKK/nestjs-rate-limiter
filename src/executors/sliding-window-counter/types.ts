export type SlidingWindowCounterOptions = {
    strategy: "sliding-window-counter";
    limit: number;
    windowMs: number;
};

export type SlidingWindowCounterState = {
    currentWindowStart: number;
    currentCount: number;
    previousCont: number;
};
