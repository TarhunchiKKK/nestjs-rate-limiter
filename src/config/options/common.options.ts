import type { Type } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory } from "../../custom/options-factories";
import type { AllStrategiesOptions } from "../../executors";
import type { ExtractMember, TokenType } from "../../shared/lib";
import type { RedisStorage, Scope, StorageTypes, Strategies } from "../../shared/model";

export type BaseOptions = {
    scope: Scope;
};

export type StorageOptions = { storage: ExtractMember<StorageTypes, "in-memory"> } | { storage: ExtractMember<StorageTypes, "redis">; instance: RedisStorage };

export type StrategyOptions = {
    strategy: Strategies;
    strategyOptions: AllStrategiesOptions;
};

export type ProvidersOptions = {
    keyExtractor: Type<IKeyExtractor> | TokenType;
    errorFactory: Type<IErrorFactory> | TokenType;
    factory?: Type<IOptionsFactory> | TokenType;
};
