import { describe, expect, it } from "bun:test";
import type { RateLimitOptions } from "../../../src";
import { normalizeOptions } from "../../../src/config/helpers";
import type { RateLimitNormalizedOptions } from "../../../src/config/options";

describe("normalizeOptions", () => {
    it("with different strategies", () => {
        const input: RateLimitOptions[] = [
            {
                strategy: "fixed-window",
                ttl: 10,
                limit: 10
            },
            {
                strategy: "token-bucket",
                ttl: 10,
                refillRate: 10,
                capacity: 10
            },
            {
                strategy: "sliding-window-counter",
                limit: 10,
                windowMs: 10
            },
            {
                strategy: "sliding-window-log",
                limit: 10,
                windowMs: 10
            },
            {
                strategy: "leaky-bucket",
                ttl: 10,
                capacity: 10,
                leakRate: 10
            }
        ];

        const output: RateLimitNormalizedOptions[] = [
            {
                strategy: "fixed-window",
                strategyOptions: {
                    "fixed-window": {
                        ttl: 10,
                        limit: 10
                    }
                }
            },
            {
                strategy: "token-bucket",
                strategyOptions: {
                    "token-bucket": {
                        ttl: 10,
                        refillRate: 10,
                        capacity: 10
                    }
                }
            },
            {
                strategy: "sliding-window-counter",
                strategyOptions: {
                    "sliding-window-counter": {
                        limit: 10,
                        windowMs: 10
                    }
                }
            },
            {
                strategy: "sliding-window-log",
                strategyOptions: {
                    "sliding-window-log": {
                        limit: 10,
                        windowMs: 10
                    }
                }
            },
            {
                strategy: "leaky-bucket",
                strategyOptions: {
                    "leaky-bucket": {
                        ttl: 10,
                        capacity: 10,
                        leakRate: 10
                    }
                }
            }
        ];

        for (let i = 0; i < input.length; i++) {
            const result = normalizeOptions(input[i]);

            expect(result).toEqual(output[i]);
        }
    });
});
