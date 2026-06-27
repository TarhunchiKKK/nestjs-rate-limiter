import type { Scope, Type } from "@nestjs/common";
import type { IKeyExtractor, KeyExtractorFn } from "../../custom/key-extractors";
import type { StrategyOptionsUnion } from "../../executors";

export type RateLimitBaseOptions = {
    scope: Scope;
};

export type RateLimitKeyExtractorOptions =
    | { keyExtractor: Type<IKeyExtractor> | string | symbol; keyExtractorFn?: never }
    | { keyExtractor?: never; keyExtractorFn: KeyExtractorFn };

export type RateLimitOptions = RateLimitBaseOptions & RateLimitKeyExtractorOptions & StrategyOptionsUnion;
