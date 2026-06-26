/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for real type providing */
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type { RateLimitBaseOptions } from "../decorators";
import type { AllStrategiesOptions } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";
import type { DeepPartial } from "../shared/ts";
import type { StorageTypes, Strategies } from "../shared/types";

export type RateLimiterOptions = {
    limiter: {
        storage: StorageTypes;
        defaults: RateLimitBaseOptions & {
            strategy: Strategies;
        };
        options: DeepPartial<AllStrategiesOptions>;
    };
    keyExtractors?: {
        default?: KeyExtractorFn | Type<IKeyExtractor>;
        custom: Provider<IKeyExtractor>[];
    };
};

export type RateLimiterAsyncOptions = Pick<ModuleMetadata, "imports"> & {
    inject: any[];

    useFactory: (...args: any[]) => RateLimiterOptions | Promise<RateLimiterOptions>;
};
