import { type ExecutionContext, type Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { StrategyOptionsUnion } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { Key } from "../shared/keys";
import type { PartialUnionMembers } from "../shared/ts";
import type { Scope } from "../shared/types";

export type RateLimitBaseOptions = {
    scope?: Scope;
    error?: (context: ExecutionContext, options: RateLimitOptions, key: Key) => Error;
};

export type RateLimitKeyExtractorOptions = { keyExtractor: Type<IKeyExtractor>; extractKeyFn: never } | { keyExtractor: never; extractKeyFn: KeyExtractorFn };

type StrategySpecificOptions = PartialUnionMembers<StrategyOptionsUnion>;

export type RateLimitOptions = RateLimitBaseOptions & RateLimitKeyExtractorOptions & StrategySpecificOptions;

export const RateLimit = Reflector.createDecorator<RateLimitOptions>();
