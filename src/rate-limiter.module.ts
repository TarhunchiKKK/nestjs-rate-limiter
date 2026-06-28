import { type DynamicModule, Global, Module, type ValueProvider } from "@nestjs/common";
import { mergeDefaultOptions } from "./config/defaults";
import { getRelevantExecutors } from "./config/helpers";
import type { RateLimiterModuleOptions, StorageOptions } from "./config/options";
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

                ProvidersDiscoveryService
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
}
