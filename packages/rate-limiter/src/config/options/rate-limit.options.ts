import type { Type } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory } from "../../custom/options-factories";
import type { StrategyOptionsUnion } from "../../executors";
import type { DeepPartial, PartialUnionMembers, TokenType } from "../../shared/lib";
import type { Scope } from "../../shared/model";
import type { StrategyOptions } from "./common.options";

export type RateLimitOptions = {
    scope?: Scope;
    keyExtractor?: Type<IKeyExtractor> | TokenType;
    errorFactory?: Type<IErrorFactory> | TokenType;
    factory?: Type<IOptionsFactory> | TokenType;
} & PartialUnionMembers<StrategyOptionsUnion>;

export type RateLimitNormalizedOptions = Pick<RateLimitOptions, "scope" | "keyExtractor" | "errorFactory" | "factory"> & DeepPartial<StrategyOptions>;
