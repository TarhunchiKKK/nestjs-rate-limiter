import { type DynamicModule, Global, Module, type ValueProvider } from "@nestjs/common";
import { mergeDefaultOptions } from "./config/defaults";
import { getRelevantExecutors } from "./config/helpers";
import type { RateLimiterModuleFullOptions, RateLimiterModuleOptions, StorageOptions } from "./config/options";
import { STORAGE_TOKEN } from "./di";
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
                RateLimiterModule.createGuardProvider(fullOptions)
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

    // FIX
    private static createGuardProvider(options: RateLimiterModuleFullOptions): ValueProvider {
        return {
            provide: RateLimitGuard,
            useValue: {
                scope: options.scope,
                strategy: options.strategy,
                strategyOptions: {
                    "fixed-window": options.strategyOptions.fixedWindow,
                    "token-bucket": options.strategyOptions.tokenBucket,
                    "sliding-window-counter": options.strategyOptions.slidingWindowCounter,
                    "sliding-window-log": options.strategyOptions.slidingWindowCounter,
                    "leaky-bucket": options.strategyOptions.leakyBucket
                },
                keyExtractor: options.keyExtractor,
                keyExtractorFn: options.keyExtractorFn
            }
        };
    }
}
