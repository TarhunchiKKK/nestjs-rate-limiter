import { type DynamicModule, type InjectionToken, Module, type Provider } from "@nestjs/common";
import type { RateLimiterModuleOptions } from "./config/options";
import { GUARD_OPTIONS_TOKEN } from "./di";

@Module({})
export class RateLimiterModule {
    public static forRoot(options: RateLimiterModuleOptions): DynamicModule {
        return {
            global: true,
            module: RateLimiterModule,
            providers: [
                {
                    provide: GUARD_OPTIONS_TOKEN,
                    useValue: options
                }

                // ...executors,
                // ...keyExtractors,

                // RateLimiterModule.getProvidersByMultiToken(EXECUTORS_TOKEN, executors),
                // RateLimiterModule.getProvidersByMultiToken(KEY_EXTRACTORS_TOKEN, keyExtractors)
            ]
        };
    }

    private static getProvidersByMultiToken<T>(token: InjectionToken, providers: Provider<T>[]): Provider {
        return {
            provide: token,
            inject: providers.map((provider) => {
                if ("provide" in provider) {
                    return provider.provide;
                }

                throw new Error(`Injection token not provided for "${provider}"`);
            }),
            useFactory: (...instances: T[]) => instances
        };
    }
}
