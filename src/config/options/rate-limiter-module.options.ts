/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../../custom/options-factories";
import type { AllStrategiesOptions } from "../../executors";
import type { TokenType } from "../../shared/nestjs";
import type { DeepPartial } from "../../shared/ts";
import type { StorageTypes, Strategies } from "../../shared/types";
import type { RateLimitBaseOptions, RateLimitErrorFactoryOptions, RateLimitKeyExtractorOptions } from "./rate-limit.options";

export type RateLimiterModuleStrategyOptions = {
    strategy?: Strategies;
    strategyOptions?: DeepPartial<AllStrategiesOptions>;
};

export type RateLimiterModuleBaseOptions = {
    storage: StorageTypes;
} & Partial<RateLimitBaseOptions>;

export type RateLimiterModuleKeyExtractorOptions = Partial<RateLimitKeyExtractorOptions>;

export type RateLimiterModuleErrorFactoryOptions = Partial<RateLimitErrorFactoryOptions>;

export type RateLimiterModuleOptionsFactoryOptions =
    | { optionsFactory: Type<IOptionsFactory> | TokenType; optionsFactoryFn?: never }
    | { optionsFactory?: never; optionsFactoryFn: OptionsFactoryFn };

export type RateLimiterModuleCustomProvidersOptions = {
    custom?: {
        keyExtractors?: Provider<IKeyExtractor>[];
        errorFactories?: Provider<IErrorFactory>[];
        optionsFactories?: Provider<IOptionsFactory>[];
    };
};

export type RateLimiterModuleOptions = RateLimiterModuleBaseOptions &
    RateLimiterModuleStrategyOptions &
    RateLimiterModuleKeyExtractorOptions &
    RateLimiterModuleErrorFactoryOptions &
    RateLimiterModuleOptionsFactoryOptions &
    RateLimiterModuleCustomProvidersOptions;

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => RateLimiterModuleOptions | Promise<RateLimiterModuleOptions>;
};
