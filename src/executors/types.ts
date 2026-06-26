import type { FixedWindowOptions } from "./fixed-window";
import type { LeakyBucketOptions } from "./leaky-bucket";
import type { SlidingWindowCounterOptions } from "./sliding-window-counter";
import type { SlidingWindowLogOptions } from "./sliding-window-log";
import type { TokenBucketOptions } from "./token-bucket";

export type AllStrategiesOptions = {
    fixedWindow: FixedWindowOptions;
    tokenBucket: TokenBucketOptions;
    slidingWindowCounter: SlidingWindowCounterOptions;
    slidingWindowLog: SlidingWindowLogOptions;
    leakyBucket: LeakyBucketOptions;
};
