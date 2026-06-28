/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../../custom/options-factories";
import type { DeepPartial, DeepRequired, FlattenOptionalNeverUnion, TokenType } from "../../shared/lib";
import type { BaseOptions, ErrorFactoryOptions, KeyExtractorOptions, StorageOptions, StrategyOptions } from "./common.options";
import type { AllStrategiesOptions } from "../../executors";

type ModuleStrategyOptions = Pick<StrategyOptions, "strategy"> & {
    strategyOptions: {
        fixedWindow: AllStrategiesOptions["fixed-window"];
        tokenBucket: AllStrategiesOptions["token-bucket"];
        slidingWindowCounter: AllStrategiesOptions["sliding-window-counter"];
        slidingWindowLog: AllStrategiesOptions["sliding-window-log"];
        leakyBucket: AllStrategiesOptions["leakey-bucket"];
    };
};

type ModuleOptionsFactoryOptions =
    | { optionsFactory: Type<IOptionsFactory> | TokenType; optionsFactoryFn?: never }
    | { optionsFactory?: never; optionsFactoryFn: OptionsFactoryFn };

type CustomProvidersOptions = {
    custom?: {
        keyExtractors?: Provider<IKeyExtractor>[];
        errorFactories?: Provider<IErrorFactory>[];
        optionsFactories?: Provider<IOptionsFactory>[];
    };
};

export type RateLimiterModuleOptions = Partial<BaseOptions> &
    StorageOptions &
    DeepPartial<ModuleStrategyOptions> &
    Partial<KeyExtractorOptions> &
    Partial<ErrorFactoryOptions> &
    Partial<ModuleOptionsFactoryOptions> &
    CustomProvidersOptions;

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => RateLimiterModuleOptions | Promise<RateLimiterModuleOptions>;
};

export type RateLimiterModuleFullOptions = BaseOptions &
    StorageOptions &
    ModuleStrategyOptions &
    KeyExtractorOptions &
    ErrorFactoryOptions &
    Partial<FlattenOptionalNeverUnion<ModuleOptionsFactoryOptions>> &
    DeepRequired<CustomProvidersOptions>;
