import type { ExecutionContext, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { FixedWindowOptions, LeakyBucketOptions, SlidingWindowCounterOptions, SlidingWindowLogOptions, TokenBucketOptions } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { Key } from "../shared/keys";
import type { ExtractMember } from "../shared/ts";
import type { Scope, Strategies } from "../shared/types";

export type RateLimitBaseOptions = {
    scope?: Scope;
    keyExtractor?: KeyExtractorFn | Type<IKeyExtractor>;
    error: (context: ExecutionContext, options: RateLimitOptions, key: Key) => Error;
};

type StrategySpecificOptions =
    | ({ strategy: ExtractMember<Strategies, "fixed-window"> } & Partial<FixedWindowOptions>)
    | ({ strategy: ExtractMember<Strategies, "token-bucket"> } & Partial<TokenBucketOptions>)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-counter"> } & Partial<SlidingWindowCounterOptions>)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-log"> } & Partial<SlidingWindowLogOptions>)
    | ({ strategy: ExtractMember<Strategies, "leaky-bucket"> } & Partial<LeakyBucketOptions>);

export type RateLimitOptions = RateLimitBaseOptions & StrategySpecificOptions;

export const RateLimit = Reflector.createDecorator<RateLimitOptions>();
