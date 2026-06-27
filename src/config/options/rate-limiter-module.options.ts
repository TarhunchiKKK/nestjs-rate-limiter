/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory } from "../../custom/options-factories";
import type { AllStrategiesOptions } from "../../executors";
import type { DeepPartial } from "../../shared/ts";
import type { StorageTypes, Strategies } from "../../shared/types";
import type { RateLimitBaseOptions, RateLimitErrorFactoryOptions, RateLimitKeyExtractorOptions, RateLimitOptionsFactoryOptions } from "./rate-limit.options";

export type RateLimiterModuleStrategyOptions = {
    strategy?: Strategies;
    strategyOptions?: DeepPartial<AllStrategiesOptions>;
};

export type RateLimiterModuleStorageOptions = {
    storage: StorageTypes;
};

export type RateLimiterModuleCustomProvidersOptions = {
    keyExtractors?: Provider<IKeyExtractor>[];
    errorFactories?: Provider<IErrorFactory>[];
    optionsFactories?: Provider<IOptionsFactory>[];
};

export type RateLimiterModuleOptions = RateLimiterModuleStorageOptions &
    RateLimiterModuleStrategyOptions &
    RateLimitBaseOptions &
    RateLimitKeyExtractorOptions &
    RateLimitErrorFactoryOptions &
    RateLimitOptionsFactoryOptions &
    RateLimiterModuleCustomProvidersOptions;

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => RateLimiterModuleOptions | Promise<RateLimiterModuleOptions>;
};
