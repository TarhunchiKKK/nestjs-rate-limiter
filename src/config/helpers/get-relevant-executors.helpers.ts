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
import type { StorageTypes } from "../../shared/model";

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
    return builtinExecutors.filter((executor) => {
        const metadata: ExecutorMetadata = Reflect.getMetadata(EXECUTOR_METADATA_KEY, executor);

        return metadata && metadata.storage === storage;
    });
}
