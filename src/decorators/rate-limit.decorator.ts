import type { Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { FixedWindowOptions, LeakyBucketOptions, SlidingWindowCounterOptions, SlidingWindowLogOptions, TokenBucketOptions } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { ExtractMember } from "../shared/ts";
import type { Strategies } from "../shared/types";

type BaseOptions = {
    scope?: string;
    keyExtractor?: KeyExtractorFn | Type<IKeyExtractor>;
};

type StrategySpecificOptions =
    | ({ strategy: ExtractMember<Strategies, "fixed-window"> } & Partial<FixedWindowOptions>)
    | ({ strategy: ExtractMember<Strategies, "token-bucket"> } & Partial<TokenBucketOptions>)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-counter"> } & Partial<SlidingWindowCounterOptions>)
    | ({ strategy: ExtractMember<Strategies, "sliding-window-log"> } & Partial<SlidingWindowLogOptions>)
    | ({ strategy: ExtractMember<Strategies, "leaky-bucket"> } & Partial<LeakyBucketOptions>);

export type RateLimitOptions = BaseOptions & StrategySpecificOptions;

export const RateLimit = Reflector.createDecorator<RateLimitOptions>();
