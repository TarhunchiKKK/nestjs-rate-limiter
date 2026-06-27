import type { Type } from "@nestjs/common";
import type { ErrorFactoryFn, IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor, KeyExtractorFn } from "../../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../../custom/options-factories";
import type { StrategyOptionsUnion } from "../../executors";
import type { TokenType } from "../../shared/nestjs";
import type { PartialUnionMembers } from "../../shared/ts";
import type { Scope } from "../../shared/types";

export type RateLimitBaseOptions = {
    scope?: Scope;
};

export type RateLimitKeyExtractorOptions =
    | { keyExtractor?: Type<IKeyExtractor> | TokenType; keyExtractorFn?: never }
    | { keyExtractor?: never; keyExtractorFn?: KeyExtractorFn };

export type RateLimitErrorFactoryOptions =
    | { errorFactory?: Type<IErrorFactory> | TokenType; errorFactoryFn?: never }
    | { errorFactory?: never; errorFactoryFn?: ErrorFactoryFn };

export type RateLimitOptionsFactoryOptions =
    | { factory?: Type<IOptionsFactory> | TokenType; optionsFactoryFn?: never }
    | { factory?: never; optionsFactoryFn?: OptionsFactoryFn };

export type RateLimitStrategyOptions = PartialUnionMembers<StrategyOptionsUnion>;

export type RateLimitOptions = RateLimitBaseOptions &
    RateLimitKeyExtractorOptions &
    RateLimitErrorFactoryOptions &
    RateLimitOptionsFactoryOptions &
    RateLimitStrategyOptions;
