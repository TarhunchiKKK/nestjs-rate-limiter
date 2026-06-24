import type { TokenBucketStrategyOptions, TokenBucketStrategyState } from "./types";

export function refillTokens(state: TokenBucketStrategyState, options: TokenBucketStrategyOptions) {
    const now = Date.now();

    const elapsed = now - state.lastRefilled;
    const refilledTokens = elapsed * options.refillRate;

    const currentTokens = Math.min(options.capacity, state.tokens + refilledTokens);

    return {
        currentTokens,
        refilledAt: now
    };
}
