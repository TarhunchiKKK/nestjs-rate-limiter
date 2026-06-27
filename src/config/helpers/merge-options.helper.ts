import type { RateLimitNormalizedOptions, RateLimitOptions } from "../options";

export function normalizeOptions(input: RateLimitOptions): RateLimitNormalizedOptions {
    const { scope, errorFactory, errorFactoryFn, factory, factoryFn, keyExtractor, keyExtractorFn, strategy, ...strategyOptions } = input;

    return {
        scope: scope,
        errorFactory,
        errorFactoryFn,
        factory,
        factoryFn,
        strategy,
        strategyOptions
    };
}
