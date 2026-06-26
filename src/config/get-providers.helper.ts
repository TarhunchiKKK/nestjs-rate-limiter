import type { Provider } from "@nestjs/common";
import {
    FixedWindowInMemoryExecutor,
    FixedWindowRedisExecutor,
    type IExecutor,
    LeakyBucketInMemoryExecutor,
    LeakyBucketRedisExecutor,
    SlidingWindowCounterInMemoryExecutor,
    SlidingWindowCounterRedisExecutor,
    SlidingWindowLogInMemoryExecutor,
    SlidingWindowLogRedisExecutor,
    TokenBucketInMemoryExecutor,
    TokenBucketRedisExecutor
} from "../executors";
import { EXECUTOR_METADATA_KEY, type ExecutorMetadata } from "../executors/executor.decorator";
import type { RateLimiterOptions } from "./rate-limiter-options.types";

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

export function getProviders(options: RateLimiterOptions) {
    const executors = builtinExecutors.filter((executor) => {
        const metadata: ExecutorMetadata = Reflect.getMetadata(EXECUTOR_METADATA_KEY, executor);

        return metadata && metadata.storage === options.limiter.storage;
    });

    const keyExtractors = options.keyExtractors?.custom ?? [];

    return { executors, keyExtractors };
}
