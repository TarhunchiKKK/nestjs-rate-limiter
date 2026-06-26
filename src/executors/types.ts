import type { ExtractMember } from "../shared/ts";
import type { Strategies } from "../shared/types";
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

export const StrategiesRenamingMap: Record<Strategies, keyof AllStrategiesOptions> = {
    "fixed-window": "fixedWindow",
    "token-bucket": "tokenBucket",
    "sliding-window-counter": "slidingWindowCounter",
    "sliding-window-log": "slidingWindowLog",
    "leaky-bucket": "leakyBucket"
};

export type StrategyOptionsUnion =
    | ({ strategy: ExtractMember<Strategies, "fixed-window"> } & FixedWindowOptions)
    | ({ strategy: ExtractMember<Strategies, "token-bucket"> } & TokenBucketOptions)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-counter"> } & SlidingWindowCounterOptions)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-log"> } & SlidingWindowLogOptions)
    | ({ strategy: ExtractMember<Strategies, "leaky-bucket"> } & LeakyBucketOptions);
