import { type DynamicModule, type FactoryProvider, Module } from "@nestjs/common";
import { mergeDefaultOptions } from "./config/defaults";
import { getRelevantExecutors } from "./config/helpers";
import type {
    RateLimiterModuleAsyncOptions,
    RateLimiterModuleFullOptions,
    RateLimiterModuleOptions,
    RateLimitGuardOptions,
    StorageOptions
} from "./config/options";
import { GUARD_OPTIONS_TOKEN, MODULE_OPTIONS_TOKEN, STORAGE_TOKEN } from "./di";
import { RateLimitGuard } from "./middleware";
import { ProvidersDiscoveryService } from "./services/providers-discovery.service";
import type { Storage } from "./shared/model";

@Module({})
export class RateLimiterModule {
    public static forRoot(options: RateLimiterModuleOptions): DynamicModule {
        const fullOptions = mergeDefaultOptions(options);

        const executors = getRelevantExecutors(options.storage);

        return {
            global: true,
            module: RateLimiterModule,
            providers: [
                { provide: MODULE_OPTIONS_TOKEN, useValue: fullOptions },
                { provide: STORAGE_TOKEN, useValue: RateLimiterModule.createStorage(fullOptions) },

                ...executors,
                ...fullOptions.custom.keyExtractors,
                ...fullOptions.custom.errorFactories,
                ...fullOptions.custom.optionsFactories,

                { provide: GUARD_OPTIONS_TOKEN, useValue: RateLimiterModule.createGuardOptions(fullOptions) },
                ProvidersDiscoveryService,
                RateLimitGuard
            ],
            exports: [RateLimitGuard]
        };
    }

    public static forRootAsync(options: RateLimiterModuleAsyncOptions): DynamicModule {
        const moduleOptionsProvider: FactoryProvider<RateLimiterModuleOptions> = {
            provide: MODULE_OPTIONS_TOKEN,
            inject: options.inject ?? [],
            useFactory: options.useFactory
        };

        const storageProvider: FactoryProvider<Storage> = {
            provide: STORAGE_TOKEN,
            inject: [MODULE_OPTIONS_TOKEN],
            useFactory: (moduleOptions: RateLimiterModuleOptions) => RateLimiterModule.createStorage(moduleOptions)
        };

        const guardOptionsProvider: FactoryProvider<RateLimitGuardOptions> = {
            provide: GUARD_OPTIONS_TOKEN,
            inject: [MODULE_OPTIONS_TOKEN],
            useFactory: (moduleOptions: RateLimiterModuleOptions) => {
                const fullOptions = mergeDefaultOptions(moduleOptions);

                return RateLimiterModule.createGuardOptions(fullOptions);
            }
        };

        return {
            global: true,
            module: RateLimiterModule,
            imports: options.imports ?? [],
            providers: [
                moduleOptionsProvider,
                storageProvider,

                // TODO: executors and custom providers

                guardOptionsProvider,
                RateLimitGuard,
                ProvidersDiscoveryService
            ],
            exports: [RateLimitGuard]
        };
    }

    private static createStorage(options: StorageOptions) {
        return options.storage === "redis" ? options.instance : new Map();
    }

    private static createGuardOptions(options: RateLimiterModuleFullOptions): RateLimitGuardOptions {
        return {
            scope: options.scope,
            strategy: options.strategy,
            strategyOptions: {
                "fixed-window": options.strategyOptions.fixedWindow,
                "token-bucket": options.strategyOptions.tokenBucket,
                "sliding-window-counter": options.strategyOptions.slidingWindowCounter,
                "sliding-window-log": options.strategyOptions.slidingWindowLog,
                "leaky-bucket": options.strategyOptions.leakyBucket
            },
            keyExtractor: options.keyExtractor,
            errorFactory: options.errorFactory,
            factory: options.optionsFactory
        };
    }
}
