import type { Scope, Type } from "@nestjs/common";
import type { ErrorFactoryFn, IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor, KeyExtractorFn } from "../../custom/key-extractors";
import type { StrategyOptionsUnion } from "../../executors";
import type { TokenType } from "../../shared/nestjs";

export type RateLimitBaseOptions = {
    scope: Scope;
};

export type RateLimitKeyExtractorOptions =
    | { keyExtractor: Type<IKeyExtractor> | TokenType; keyExtractorFn?: never }
    | { keyExtractor?: never; keyExtractorFn: KeyExtractorFn };

export type RateLimitErrorFactoryOptions =
    | { errorFactory: Type<IErrorFactory> | TokenType; errorFactoryFn?: never }
    | { errorFactory?: never; errorFactoryFn: ErrorFactoryFn };

export type RateLimitOptions = RateLimitBaseOptions & RateLimitKeyExtractorOptions & RateLimitErrorFactoryOptions & StrategyOptionsUnion;
