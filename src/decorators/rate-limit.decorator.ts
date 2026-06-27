import { applyDecorators, type ExecutionContext, type Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { StrategyOptionsUnion } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { Key } from "../shared/keys";
import type { DeepRequired, OptionalToNull, PartialUnionMembers } from "../shared/ts";
import type { Scope } from "../shared/types";

export type ErrorFactoryOptions = DeepRequired<RateLimitBaseOptions> & {
    strategyOptions: StrategyOptionsUnion;
};

export type RateLimitBaseOptions = {
    scope?: Scope;
    // REFACTOR: rename into `errorFactory`
    error?: (context: ExecutionContext, options: ErrorFactoryOptions, key: Key) => Error;
};

export type RateLimitKeyExtractorOptions = { keyExtractor?: Type<IKeyExtractor>; extractKeyFn: never } | { keyExtractor: never; extractKeyFn?: KeyExtractorFn };

type StrategySpecificOptions = PartialUnionMembers<StrategyOptionsUnion>;

export type RateLimitOptions = RateLimitBaseOptions & RateLimitKeyExtractorOptions & StrategySpecificOptions;

export type RateLimitRealOptions = OptionalToNull<RateLimitBaseOptions> & {
    keyExtractor: Type<IKeyExtractor> | null;
    extractKeyFn: KeyExtractorFn | null;
    strategyOptions: Partial<StrategyOptionsUnion>;
};

export const RateLimitDecorator = Reflector.createDecorator<RateLimitRealOptions>();

export function RateLimit(options: RateLimitOptions) {
    const { scope, error, extractKeyFn, keyExtractor, ...strategyOptions } = options;

    const realOptions: RateLimitRealOptions = {
        scope: scope ?? null,
        error: error ?? null,
        extractKeyFn: extractKeyFn ?? null,
        keyExtractor: keyExtractor ?? null,
        strategyOptions: strategyOptions
    };

    return applyDecorators(RateLimitDecorator(realOptions));
}
