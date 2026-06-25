export type SlidingWindowLogOptions = {
    strategy: "sliding-window-log"
    limit: number;
    windowMs: number;
}

export type SlidingWindowLogState = number[]