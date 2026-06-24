import { describe, expect, it } from "bun:test";
import { refillTokens } from "../../../../../src/core/strategies/token-bucket/lib";
import type { TokenBucketStrategyOptions, TokenBucketStrategyState } from "../../../../../src/core/strategies/token-bucket/types";
import { MS_IN_MINUTE } from "../../../../mocks";

describe("refillTokens", () => {
    it("basic case", () => {
        const refillTokensPerMinute = 3;

        const state: TokenBucketStrategyState = {
            tokens: 10,
            lastRefilled: Date.now() - MS_IN_MINUTE // one minute ago
        };

        const options: TokenBucketStrategyOptions = {
            strategy: "token-bucket",
            capacity: 100,
            refillRate: refillTokensPerMinute / MS_IN_MINUTE // 3 tokens per minute
        };

        const result = refillTokens(state, options);

        expect(result.currentTokens).toBeGreaterThanOrEqual(state.tokens + refillTokensPerMinute - 1);
        expect(result.currentTokens).toBeLessThanOrEqual(state.tokens + refillTokensPerMinute + 1);
    });

    it("tokens count is more than capacity", () => {
        const state: TokenBucketStrategyState = {
            tokens: 9,
            lastRefilled: Date.now() - MS_IN_MINUTE // one minute ago
        };

        const options: TokenBucketStrategyOptions = {
            strategy: "token-bucket",
            capacity: 10,
            refillRate: 3 / MS_IN_MINUTE // 3 tokens per minute
        };

        const result = refillTokens(state, options);

        expect(result.currentTokens).toBe(options.capacity);
    });

    it("negative/zero elapsed time", () => {
        const state: TokenBucketStrategyState = {
            tokens: 9,
            lastRefilled: Date.now() + MS_IN_MINUTE // one minute after
        };

        const options: TokenBucketStrategyOptions = {
            strategy: "token-bucket",
            capacity: 10,
            refillRate: 3 / MS_IN_MINUTE // 3 tokens per minute
        };

        const result = refillTokens(state, options);

        expect(result.currentTokens).toBe(state.tokens);
    });

    it("zero tokens state", () => {
        const state: TokenBucketStrategyState = {
            tokens: 0,
            lastRefilled: Date.now() - MS_IN_MINUTE
        };
        const options: TokenBucketStrategyOptions = {
            strategy: "token-bucket",
            capacity: 10,
            refillRate: 1 / (2 * MS_IN_MINUTE) // one per 2 minutes
        };

        const result = refillTokens(state, options);

        expect(result.currentTokens).toBeLessThan(1);
    });
});
