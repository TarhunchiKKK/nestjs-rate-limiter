import type { ExtractMember } from "../../shared/lib";
import type { Strategies } from "../../shared/model";
import type { FixedWindowOptions } from "../variants/fixed-window";
import type { LeakyBucketOptions } from "../variants/leaky-bucket";
import type { SlidingWindowCounterOptions } from "../variants/sliding-window-counter";
import type { SlidingWindowLogOptions } from "../variants/sliding-window-log";
import type { TokenBucketOptions } from "../variants/token-bucket";

export type AllStrategiesOptions = {
    fixedWindow: FixedWindowOptions;
    tokenBucket: TokenBucketOptions;
    slidingWindowCounter: SlidingWindowCounterOptions;
    slidingWindowLog: SlidingWindowLogOptions;
    leakyBucket: LeakyBucketOptions;
};

export type StrategyOptionsUnion =
    | ({ strategy: ExtractMember<Strategies, "fixed-window"> } & FixedWindowOptions)
    | ({ strategy: ExtractMember<Strategies, "token-bucket"> } & TokenBucketOptions)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-counter"> } & SlidingWindowCounterOptions)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-log"> } & SlidingWindowLogOptions)
    | ({ strategy: ExtractMember<Strategies, "leaky-bucket"> } & LeakyBucketOptions);
