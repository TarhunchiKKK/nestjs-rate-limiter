import { StrategiesRenamingMap } from "../../executors";
import type { RateLimitNormalizedOptions, RateLimitOptions } from "../options";

export function normalizeOptions(options: RateLimitOptions): RateLimitNormalizedOptions {
    const { scope, errorFactory, errorFactoryFn, factory, factoryFn, keyExtractor, keyExtractorFn, strategy, ...strategyOptions } = options;

    return {
        scope: scope,
        errorFactory,
        errorFactoryFn,
        factory,
        factoryFn,
        strategy,
        strategyOptions: strategy ? { [StrategiesRenamingMap[strategy]]: strategyOptions } : undefined
    };
}
