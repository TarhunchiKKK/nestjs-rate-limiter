import type { FixedWindowOptions, LeakyBucketOptions, SlidingWindowCounterOptions, SlidingWindowLogOptions, TokenBucketOptions } from "../../executors";
import type { StorageTypes, Strategies } from "../../shared/types";
import type { ExtractMember } from "../../shared/typescript";

type ExecutorOptionsMap = {
    "fixed-window": {
        "in-memory": {
            strategy: ExtractMember<Strategies, "fixed-window">;
            storage: ExtractMember<StorageTypes, "in-memory">;
        } & FixedWindowOptions["in-memory"];
        redis: {
            strategy: ExtractMember<Strategies, "fixed-window">;
            storage: ExtractMember<StorageTypes, "redis">;
        } & FixedWindowOptions["redis"];
    };
    "token-bucket": {
        "in-memory": {
            strategy: ExtractMember<Strategies, "token-bucket">;
            storage: ExtractMember<StorageTypes, "in-memory">;
        } & TokenBucketOptions["in-memory"];
        redis: {
            strategy: ExtractMember<Strategies, "token-bucket">;
            storage: ExtractMember<StorageTypes, "redis">;
        } & TokenBucketOptions["redis"];
    };
    "sliding-window-counter": {
        "in-memory": {
            strategy: ExtractMember<Strategies, "sliding-window-counter">;
            storage: ExtractMember<StorageTypes, "in-memory">;
        } & SlidingWindowCounterOptions["in-memory"];
        redis: {
            strategy: ExtractMember<Strategies, "sliding-window-counter">;
            storage: ExtractMember<StorageTypes, "redis">;
        } & SlidingWindowCounterOptions["redis"];
    };
    "sliding-window-log": {
        "in-memory": {
            strategy: ExtractMember<Strategies, "sliding-window-log">;
            storage: ExtractMember<StorageTypes, "in-memory">;
        } & SlidingWindowLogOptions["in-memory"];
        redis: {
            strategy: ExtractMember<Strategies, "sliding-window-log">;
            storage: ExtractMember<StorageTypes, "redis">;
        } & SlidingWindowLogOptions["redis"];
    };
    "leaky-bucket": {
        "in-memory": {
            strategy: ExtractMember<Strategies, "leaky-bucket">;
            storage: ExtractMember<StorageTypes, "in-memory">;
        } & LeakyBucketOptions["in-memory"];
        redis: {
            strategy: ExtractMember<Strategies, "leaky-bucket">;
            storage: ExtractMember<StorageTypes, "redis">;
        } & LeakyBucketOptions["redis"];
    };
};

export type ExecutorOptions =
    | ExecutorOptionsMap["fixed-window"]["in-memory"]
    | ExecutorOptionsMap["fixed-window"]["redis"]
    | ExecutorOptionsMap["token-bucket"]["in-memory"]
    | ExecutorOptionsMap["token-bucket"]["redis"]
    | ExecutorOptionsMap["sliding-window-counter"]["in-memory"]
    | ExecutorOptionsMap["sliding-window-counter"]["redis"]
    | ExecutorOptionsMap["sliding-window-log"]["in-memory"]
    | ExecutorOptionsMap["sliding-window-log"]["redis"]
    | ExecutorOptionsMap["leaky-bucket"]["in-memory"]
    | ExecutorOptionsMap["leaky-bucket"]["redis"];
