import { type DynamicModule, type FactoryProvider, Global, Module, type ValueProvider } from "@nestjs/common";
import { mergeDefaultOptions } from "./config/defaults";
import { getRelevantExecutors } from "./config/helpers";
import type { RateLimiterModuleFullOptions, RateLimiterModuleOptions, RateLimitGuardOptions, StorageOptions } from "./config/options";
import type { ErrorFactoryFn } from "./custom/error-factories";
import type { KeyExtractorFn } from "./custom/key-extractors";
import type { OptionsFactoryFn } from "./custom/options-factories";
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
    private static createGuardProvider(options: RateLimiterModuleFullOptions): FactoryProvider<RateLimitGuardOptions> {
        return {
            provide: RateLimitGuard,
            inject: [ProvidersDiscoveryService],
            useFactory: (discoveryService: ProvidersDiscoveryService) => {
                let keyExtractorFn: KeyExtractorFn;
                if (options.keyExtractor) {
                    keyExtractorFn = discoveryService.getKeyExtractor(options.keyExtractor);
                } else if (options.keyExtractorFn) {
                    keyExtractorFn = options.keyExtractorFn;
                }

                let errorFactoryFn: ErrorFactoryFn;
                if (options.errorFactory) {
                    errorFactoryFn = discoveryService.getErrorFactory(options.errorFactory);
                } else if (options.errorFactoryFn) {
                    errorFactoryFn = options.errorFactoryFn;
                }

                let optionsFactoryFn: OptionsFactoryFn | undefined;
                if (options.optionsFactory) {
                    optionsFactoryFn = discoveryService.getOptionsFactory(options.optionsFactory);
                } else if (options.optionsFactoryFn) {
                    optionsFactoryFn = options.optionsFactoryFn;
                }

                return {
                    scope: options.scope,
                    strategy: options.strategy,
                    strategyOptions: {
                        "fixed-window": options.strategyOptions.fixedWindow,
                        "token-bucket": options.strategyOptions.tokenBucket,
                        "sliding-window-counter": options.strategyOptions.slidingWindowCounter,
                        "sliding-window-log": options.strategyOptions.slidingWindowCounter,
                        "leaky-bucket": options.strategyOptions.leakyBucket
                    },
                    // biome-ignore lint/style/noNonNullAssertion: Key extractor will be provided in any case (default options contains it)
                    keyExtractorFn: keyExtractorFn!,
                    // biome-ignore lint/style/noNonNullAssertion: Error factory will be provided in any case (default options contains it)
                    errorFactoryFn: errorFactoryFn!,
                    factoryFn: optionsFactoryFn
                };
            }
        };
    }
}
