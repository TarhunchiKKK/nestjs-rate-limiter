import type { RateLimitNormalizedOptions, RateLimitOptions } from "../options";

export function normalizeOptions(options: RateLimitOptions): RateLimitNormalizedOptions {
    const { scope, keyExtractor, errorFactory, factory, strategy, ...strategyOptions } = options;

    return {
        scope: scope,
        keyExtractor,
        errorFactory,
        factory,
        strategy,
        strategyOptions: strategy ? { [strategy]: strategyOptions } : undefined
    };
}
