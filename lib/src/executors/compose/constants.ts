import { FixedWindowInMemoryExecutor, FixedWindowRedisExecutor } from "../variants/fixed-window";
import { LeakyBucketInMemoryExecutor, LeakyBucketRedisExecutor } from "../variants/leaky-bucket";
import { SlidingWindowCounterInMemoryExecutor, SlidingWindowCounterRedisExecutor } from "../variants/sliding-window-counter";
import { SlidingWindowLogInMemoryExecutor, SlidingWindowLogRedisExecutor } from "../variants/sliding-window-log";
import { TokenBucketInMemoryExecutor, TokenBucketRedisExecutor } from "../variants/token-bucket";

export const AVAILABLE_EXECUTORS = [
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
