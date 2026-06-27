import type { Type } from "@nestjs/common";
import type { ErrorFactoryFn, IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor, KeyExtractorFn } from "../../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../../custom/options-factories";
import type { AllStrategiesOptions } from "../../executors";
import type { TokenType } from "../../shared/nestjs";
import type { Scope, StorageTypes, Strategies } from "../../shared/types";

export type BaseOptions = {
    scope: Scope;
};

export type StorageOptions = {
    storage: StorageTypes;
};

export type StrategyOptions = {
    strategy: Strategies;
    strategyOptions: AllStrategiesOptions;
};

export type KeyExtractorOptions =
    | { keyExtractor: Type<IKeyExtractor> | TokenType; keyExtractorFn?: never }
    | { keyExtractor?: never; keyExtractorFn: KeyExtractorFn };

export type ErrorFactoryOptions =
    | { errorFactory: Type<IErrorFactory> | TokenType; errorFactoryFn?: never }
    | { errorFactory?: never; errorFactoryFn: ErrorFactoryFn };

export type OptionsFactoryOptions = { factory: Type<IOptionsFactory> | TokenType; factoryFn?: never } | { factory?: never; factoryFn: OptionsFactoryFn };
