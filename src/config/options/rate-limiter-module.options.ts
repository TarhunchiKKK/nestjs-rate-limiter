/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider } from "@nestjs/common";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory } from "../../custom/options-factories";
import type { BaseOptions, ErrorFactoryOptions, KeyExtractorOptions, OptionsFactoryOptions, StorageOptions, StrategyOptions } from "./common.options";

export type CustomProvidersOptions = {
    custom?: {
        keyExtractors?: Provider<IKeyExtractor>[];
        errorFactories?: Provider<IKeyExtractor>[];
        optionsFactories?: Provider<IOptionsFactory>[];
    };
};

export type RateLimiterModuleOptions = Partial<BaseOptions> &
    Partial<KeyExtractorOptions> &
    Partial<ErrorFactoryOptions> &
    Partial<OptionsFactoryOptions> &
    Partial<StrategyOptions> &
    StorageOptions &
    CustomProvidersOptions;

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => RateLimiterModuleOptions | Promise<RateLimiterModuleOptions>;
};
