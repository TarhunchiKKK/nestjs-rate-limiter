import { Module, type DynamicModule, type InjectionToken, type Provider } from "@nestjs/common";
import { getProviders, type RateLimiterOptions } from "./config";
import { CLEANERS_TOKEN, EXECUTORS_TOKEN, GUARD_OPTIONS_TOKEN, KEY_EXTRACTORS_TOKEN, OPTIONS_TOKEN } from "./di";
import type { RateLimitGuardOptions } from "./middleware";
import { getExecutorMapKey, type IExecutor } from "./executors";
import { ipKeyExtractor, type IKeyExtractor, type KeyExtractorFn } from "./key-extractors";
import { EXECUTOR_METADATA_KEY, type ExecutorMetadata } from "./executors/executor.decorator";

@Module({})
export class RateLimiterModule {
    public static forRoot(options: RateLimiterOptions): DynamicModule {
        const { executors, keyExtractors, cleaners } = getProviders(options);

        return {
            global: true,
            module: RateLimiterModule,
            providers: [
                {
                    provide: OPTIONS_TOKEN,
                    useValue: options
                },

                ...executors,
                ...keyExtractors,
                ...cleaners,

                RateLimiterModule.getProvidersByMultiToken(EXECUTORS_TOKEN, executors),
                RateLimiterModule.getProvidersByMultiToken(KEY_EXTRACTORS_TOKEN, keyExtractors),
                RateLimiterModule.getProvidersByMultiToken(CLEANERS_TOKEN, cleaners),

                RateLimiterModule.getGuardOptions(),
            ]
        }
    }

    private static getProvidersByMultiToken<T>(token: InjectionToken, providers: Provider<T>[]): Provider {
        return {
            provide: token,
            inject: providers.map(provider => {
                if ("provide" in provider) {
                    return provider.provide;
                }

                throw new Error(`Rate Limiter: Injection token not provided for "${provider}"`)
            }),
            useFactory: (...instances: T[]) => instances
        }
    }

    private static getGuardOptions(): Provider<RateLimitGuardOptions> {
        return {
            provide: GUARD_OPTIONS_TOKEN,
            inject: [OPTIONS_TOKEN, EXECUTORS_TOKEN, KEY_EXTRACTORS_TOKEN],
            useFactory: (options: RateLimiterOptions, executors: IExecutor<unknown>[], keyExtractors: IKeyExtractor[]) => {
                const executorsMap = new Map<string, IExecutor<unknown>>()
                const keyExtractorsMap = new Map<InjectionToken, IKeyExtractor>();

                for (const executor of executors) {
                    const metadata: ExecutorMetadata = Reflect.getMetadata(EXECUTOR_METADATA_KEY, executor);

                    if (metadata) {
                        executorsMap.set(getExecutorMapKey(metadata), executor)
                    }
                }

                for (const keyExtractor of keyExtractors) {
                    keyExtractorsMap.set(keyExtractor.constructor, keyExtractor);
                }

                const defaultExecutor = executorsMap.get(getExecutorMapKey(options.limiter));

                if (!defaultExecutor) {
                    throw new Error(`Default executor not found for ${options.limiter}`)
                }


                let defaultKeyExtractor: KeyExtractorFn | IKeyExtractor;
                if (!options.keyExtractor?.default) {
                    defaultKeyExtractor = ipKeyExtractor
                }

                // TODO: add is class check
                // else if (Reflect.getMetadata(options.keyExtractor.default)) {
                //     defaultKeyExtractor = keyExtractorsMap.get(options.keyExtractor.default.constructor) ?? ipKeyExtractor
                // } else {
                //     defaultExecutor = options.keyExtractor.default
                // }

                return {
                    limiter: options.limiter,
                    executors: {
                        default: defaultExecutor,
                        custom: executorsMap
                    },
                    keyExtractors: {
                        default: defaultKeyExtractor,
                        custom: keyExtractorsMap
                    }
                }

            }
        }
    }
}
