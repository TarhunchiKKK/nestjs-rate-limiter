/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../../custom/options-factories";
import type { DeepRequired, FlattenOptionalNeverUnion, TokenType } from "../../shared/lib";
import type { BaseOptions, ErrorFactoryOptions, KeyExtractorOptions, StorageOptions, StrategyOptions } from "./common.options";

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
    Partial<KeyExtractorOptions> &
    Partial<ErrorFactoryOptions> &
    Partial<ModuleOptionsFactoryOptions> &
    Partial<StrategyOptions> &
    StorageOptions &
    CustomProvidersOptions;

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => RateLimiterModuleOptions | Promise<RateLimiterModuleOptions>;
};

export type RateLimiterModuleFullOptions = BaseOptions &
    StorageOptions &
    StrategyOptions &
    KeyExtractorOptions &
    ErrorFactoryOptions &
    Partial<FlattenOptionalNeverUnion<ModuleOptionsFactoryOptions>> &
    DeepRequired<CustomProvidersOptions>;
