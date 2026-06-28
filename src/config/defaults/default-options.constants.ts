import { defaultErrorFactoryFn } from "../../custom/error-factories";
import { ipKeyExtractor } from "../../custom/key-extractors";
import { MS_IN_MINUTE } from "../../shared/lib";
import { DEFAULT_SCOPE } from "../../shared/model";
import type { RateLimiterModuleFullOptions } from "../options";

export const RATE_LIMITER_MODULE_DEFAULT_OPTIONS = {
    storage: "in-memory",
    scope: DEFAULT_SCOPE,

    strategy: "fixed-window",
    strategyOptions: {
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
    },

    keyExtractor: undefined,
    keyExtractorFn: ipKeyExtractor,
    errorFactory: undefined,
    errorFactoryFn: defaultErrorFactoryFn,
    optionsFactory: undefined,
    optionsFactoryFn: undefined,

    custom: {
        keyExtractors: [],
        errorFactories: [],
        optionsFactories: []
    }
} satisfies RateLimiterModuleFullOptions;
