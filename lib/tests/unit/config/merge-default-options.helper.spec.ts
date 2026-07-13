import { describe, expect } from "bun:test";
import { it } from "node:test";
import type { RateLimiterModuleOptions } from "../../../src";
import { mergeDefaultOptions } from "../../../src/config/defaults";
import { RATE_LIMITER_MODULE_DEFAULT_OPTIONS } from "../../../src/config/defaults/default-options.constants";
import { DEFAULT_SCOPE } from "../../../src/shared/model";

describe("mergeDefaultOptions", () => {
    describe("scope", () => {
        it("default", () => {
            const input = {
                storage: "in-memory"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.scope).toBe(DEFAULT_SCOPE);
        });

        it("custom", () => {
            const input = {
                storage: "in-memory",
                scope: "custom-scope"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.scope).toBe(input.scope);
        });
    });

    describe("storage", () => {
        it("in-memory storage", () => {
            const input = {
                storage: "in-memory"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.storage).toBe(input.storage);
        });

        it("redis storage", () => {
            const input = {
                storage: "redis",
                instance: {
                    eval: () => Promise.resolve(1)
                }
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.storage).toBe(input.storage);
            // biome-ignore lint/complexity/useLiteralKeys: This property is not visible for TypeScript
            expect(result["instance"]).toEqual(input.instance);
        });
    });

    describe("strategy", () => {
        it("default", () => {
            const input = {
                storage: "in-memory"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.strategy).toBe(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategy);
        });

        it("custom", () => {
            const input = {
                storage: "in-memory",
                strategy: "sliding-window-log"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.strategy).toBe(input.strategy);
        });

        it("strategy options", () => {
            const input = {
                storage: "in-memory",
                strategyOptions: {
                    fixedWindow: {
                        // full strategy options
                        ttl: 10,
                        limit: 10
                    },
                    tokenBucket: {
                        // partial options
                        ttl: 10
                    },
                    slidingWindowCounter: {
                        // empty options
                    }
                    // no options for remaining strategies
                }
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            // expectations for full options object
            expect(result.strategyOptions.fixedWindow).toEqual(input.strategyOptions.fixedWindow);

            // expectations for partial options object
            expect(result.strategyOptions.tokenBucket.ttl).toBe(input.strategyOptions.tokenBucket.ttl);
            expect(result.strategyOptions.tokenBucket.refillRate).toBe(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.tokenBucket.refillRate);
            expect(result.strategyOptions.tokenBucket.capacity).toBe(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.tokenBucket.capacity);

            // expectations for empty options objects
            expect(result.strategyOptions.slidingWindowCounter).toEqual(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowCounter);
            expect(result.strategyOptions.slidingWindowLog).toEqual(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.slidingWindowLog);
            expect(result.strategyOptions.leakyBucket).toEqual(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.strategyOptions.leakyBucket);
        });
    });

    describe("providers", () => {
        it("default", () => {});

        it("custom", () => {});
    });
});
