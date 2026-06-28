import { type DynamicModule, Global, Module, type ValueProvider } from "@nestjs/common";
import { mergeDefaultOptions } from "./config/defaults";
import { getRelevantExecutors } from "./config/helpers";
import type { RateLimiterModuleFullOptions, RateLimiterModuleOptions, RateLimitGuardOptions, StorageOptions } from "./config/options";
import { GUARD_OPTIONS_TOKEN, STORAGE_TOKEN } from "./di";
import { RateLimitGuard } from "./middleware";
import { ProvidersDiscoveryService } from "./services/providers-discovery.service";
import type { Storage } from "./shared/model";

@Global()
@Module({})
export class RateLimiterModule {
    public static forRoot(options: RateLimiterModuleOptions): DynamicModule {
        const fullOptions = mergeDefaultOptions(options);

        const executors = getRelevantExecutors(options.storage);

        return {
            global: true,
            module: RateLimiterModule,
            providers: [
                RateLimiterModule.createStorageProvider(fullOptions),
                ...executors,
                ...fullOptions.custom.keyExtractors,
                ...fullOptions.custom.errorFactories,
                ...fullOptions.custom.optionsFactories,

                ProvidersDiscoveryService,
                RateLimiterModule.createGuardOptionsProvider(fullOptions)
            ],
            exports: [RateLimitGuard]
        };
    }

    private static createStorageProvider(options: StorageOptions): ValueProvider<Storage> {
        return {
            provide: STORAGE_TOKEN,
            useValue: options.storage === "redis" ? options.instance : new Map()
        };
    }

    private static createGuardOptionsProvider(options: RateLimiterModuleFullOptions): ValueProvider<RateLimitGuardOptions> {
        return {
            provide: GUARD_OPTIONS_TOKEN,
            useValue: {
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
            }
        };
    }
}
