import { ForbiddenException } from "@nestjs/common";
import { ipKeyExtractor } from "../custom/key-extractors";
import { MS_IN_MINUTE } from "../shared/date";
import type { DeepRequired } from "../shared/ts";
import type { RateLimiterOptions } from "./rate-limiter-options.types";

export const RATE_LIMITER_DEFAULT_OPTIONS: DeepRequired<RateLimiterOptions> = {
    limiter: {
        storage: "in-memory",
        defaults: {
            strategy: "fixed-window",
            scope: "default-scope",
            error: () => new ForbiddenException("Request limit exhausted")
        },
        options: {
            fixedWindow: {
                limit: 100,
                ttl: MS_IN_MINUTE
            },
            slidingWindowCounter: {
                limit: 100,
                windowMs: MS_IN_MINUTE
            },
            slidingWindowLog: {
                limit: 50,
                windowMs: MS_IN_MINUTE
            },
            tokenBucket: {
                capacity: 20,
                refillRate: 5 / MS_IN_MINUTE,
                ttl: 3 * MS_IN_MINUTE
            },
            leakyBucket: {
                capacity: 10,
                leakRate: 2 / MS_IN_MINUTE,
                ttl: 3 * MS_IN_MINUTE
            }
        }
    },
    keyExtractors: {
        default: ipKeyExtractor,
        custom: []
    }
};
