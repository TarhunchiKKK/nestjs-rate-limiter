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
        it("default", () => {
            const input = {
                storage: "in-memory"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.keyExtractor).toBeDefined();
            expect(result.errorFactory).toBeDefined();
            expect(result.optionsFactory).toBeUndefined();

            expect(result.custom.keyExtractors).toHaveLength(0);
            expect(result.custom.errorFactories).toHaveLength(0);
            expect(result.custom.optionsFactories).toHaveLength(0);
        });

        it("override default", () => {
            const input = {
                storage: "in-memory",

                keyExtractor: "key-extractor-token",
                errorFactory: "error-factory-token",
                optionsFactory: "options-factory-token"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.keyExtractor).toEqual(input.keyExtractor);
            expect(result.errorFactory).toEqual(input.errorFactory);
            expect(result.optionsFactory).toEqual(input.optionsFactory);
        });

        it("custom", () => {
            const input = {
                storage: "in-memory",

                custom: {
                    keyExtractors: [
                        {
                            provide: "key-extractor-token",
                            useValue: { extract: () => "key" }
                        }
                    ],
                    errorFactories: [
                        // no providers listed
                    ]
                    // no providers for options factories
                }
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.custom.keyExtractors).toEqual(input.custom.keyExtractors);
            expect(result.custom.errorFactories).toEqual(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.errorFactories);
            expect(result.custom.optionsFactories).toEqual(RATE_LIMITER_MODULE_DEFAULT_OPTIONS.custom.optionsFactories);
        });
    });
});
