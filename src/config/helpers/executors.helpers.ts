import type { Provider } from "@nestjs/common";
import {
    FixedWindowInMemoryExecutor,
    FixedWindowRedisExecutor,
    LeakyBucketInMemoryExecutor,
    LeakyBucketRedisExecutor,
    SlidingWindowCounterInMemoryExecutor,
    SlidingWindowCounterRedisExecutor,
    SlidingWindowLogInMemoryExecutor,
    SlidingWindowLogRedisExecutor,
    TokenBucketInMemoryExecutor,
    TokenBucketRedisExecutor,
    type IExecutor
} from "../../executors";
import { EXECUTOR_METADATA_KEY, type ExecutorMetadata } from "../../executors/executor.decorator";
import type { RateLimiterOptions } from "../options";
import "reflect-metadata";

const builtinExecutors: Provider<IExecutor<unknown>>[] = [
    FixedWindowInMemoryExecutor,
    FixedWindowRedisExecutor,
    TokenBucketInMemoryExecutor,
    TokenBucketRedisExecutor,
    SlidingWindowCounterInMemoryExecutor,
    SlidingWindowCounterRedisExecutor,
    SlidingWindowLogInMemoryExecutor,
    SlidingWindowLogRedisExecutor,
    LeakyBucketInMemoryExecutor,
    LeakyBucketRedisExecutor
];

export function getExecutors(options: RateLimiterOptions): Provider<IExecutor<unknown>>[] {
    const builtInExecutorsByStorage = builtinExecutors.filter((executor) => {
        const metadata: ExecutorMetadata = Reflect.getMetadata(EXECUTOR_METADATA_KEY, executor);

        return metadata && metadata.storage === options.limiter.storage;
    });

    const customExecutors = options.custom?.executors ?? [];

    return [...builtInExecutorsByStorage, ...customExecutors];
}
