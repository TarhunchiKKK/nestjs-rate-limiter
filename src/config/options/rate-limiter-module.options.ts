/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory } from "../../custom/options-factories";
import type { AllStrategiesOptions } from "../../executors";
import type { DeepRequired, OmitFields } from "../../shared/lib";
import type { BaseOptions, ProvidersOptions, StorageOptions, StrategyOptions } from "./common.options";

export type ModuleStrategyOptions = Pick<StrategyOptions, "strategy"> & {
    strategyOptions?: {
        fixedWindow?: Partial<AllStrategiesOptions["fixed-window"]>;
        tokenBucket?: Partial<AllStrategiesOptions["token-bucket"]>;
        slidingWindowCounter?: Partial<AllStrategiesOptions["sliding-window-counter"]>;
        slidingWindowLog?: Partial<AllStrategiesOptions["sliding-window-log"]>;
        leakyBucket?: Partial<AllStrategiesOptions["leaky-bucket"]>;
    };
};

export type ModuleProvidersOptions = Partial<
    Pick<ProvidersOptions, "keyExtractor" | "errorFactory"> & {
        optionsFactory: ProvidersOptions["factory"];
    }
>;

export type ModuleCustomProvidersOptions = {
    custom?: {
        keyExtractors?: Provider<IKeyExtractor>[];
        errorFactories?: Provider<IErrorFactory>[];
        optionsFactories?: Provider<IOptionsFactory>[];
    };
};

export type RateLimiterModuleOptions = Partial<BaseOptions> & StorageOptions & ModuleStrategyOptions & ModuleProvidersOptions & ModuleCustomProvidersOptions;

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => RateLimiterModuleOptions | Promise<RateLimiterModuleOptions>;
};

export type RateLimiterModuleFullOptions = DeepRequired<OmitFields<RateLimiterModuleOptions, "optionsFactory">> & {
    optionsFactory: ProvidersOptions["factory"];
};
