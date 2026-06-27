import type { Provider } from "@nestjs/common";
import {
    EXECUTOR_METADATA_KEY,
    type ExecutorMetadata,
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
} from "../../executors";
import type { StorageTypes } from "../../shared/types";

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

export function getRelevantExecutors(storage: StorageTypes) {
    builtinExecutors.filter((executor) => {
        const metadata: ExecutorMetadata = Reflect.getMetadata(EXECUTOR_METADATA_KEY, executor);

        return metadata && metadata.storage === storage;
    });
}
