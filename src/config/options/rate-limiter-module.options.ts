/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { IErrorFactory } from "../../custom/error-factories";
import type { IKeyExtractor } from "../../custom/key-extractors";
import type { IOptionsFactory } from "../../custom/options-factories";
import type { AllStrategiesOptions } from "../../executors";
import type { OmitFields, TokenType } from "../../shared/lib";
import type { Scope, Strategies } from "../../shared/model";
import type { StorageOptions } from "./common.options";

export type RateLimiterModuleOptions = StorageOptions & {
    scope?: Scope;

    strategy?: Strategies;
    strategyOptions: {
        fixedWindow?: Partial<AllStrategiesOptions["fixed-window"]>;
        tokenBucket?: Partial<AllStrategiesOptions["token-bucket"]>;
        slidingWindowCounter?: Partial<AllStrategiesOptions["sliding-window-counter"]>;
        slidingWindowLog?: Partial<AllStrategiesOptions["sliding-window-log"]>;
        leakyBucket?: Partial<AllStrategiesOptions["leaky-bucket"]>;
    };

    keyExtractor?: Type<IKeyExtractor> | TokenType;
    errorFactory?: Type<IErrorFactory> | TokenType;
    optionsFactory?: Type<IOptionsFactory> | TokenType;

    custom?: {
        keyExtractors?: Provider<IKeyExtractor>[];
        errorFactories?: Provider<IErrorFactory>[];
        optionsFactories?: Provider<IOptionsFactory>[];
    };
};

export type RateLimiterModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject?: any[];
    useFactory: (...args: any[]) => OmitFields<RateLimiterModuleOptions, "custom"> | Promise<OmitFields<RateLimiterModuleOptions, "custom">>;
    custom?: RateLimiterModuleOptions["custom"];
};

export type RateLimiterModuleFullOptions = StorageOptions & {
    scope: Scope;

    strategy: Strategies;
    strategyOptions: {
        fixedWindow: AllStrategiesOptions["fixed-window"];
        tokenBucket: AllStrategiesOptions["token-bucket"];
        slidingWindowCounter: AllStrategiesOptions["sliding-window-counter"];
        slidingWindowLog: AllStrategiesOptions["sliding-window-log"];
        leakyBucket: AllStrategiesOptions["leaky-bucket"];
    };

    keyExtractor: Type<IKeyExtractor> | TokenType;
    errorFactory: Type<IErrorFactory> | TokenType;
    optionsFactory?: Type<IOptionsFactory> | TokenType;

    custom: {
        keyExtractors: Provider<IKeyExtractor>[];
        errorFactories: Provider<IErrorFactory>[];
        optionsFactories: Provider<IOptionsFactory>[];
    };
};
