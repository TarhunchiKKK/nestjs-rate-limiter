import { Inject, Injectable, type InjectionToken, type OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core";
import type { ErrorFactoryFn, IErrorFactory } from "../custom/error-factories";
import type { IKeyExtractor, KeyExtractorFn } from "../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../custom/options-factories";
import type { IExecutor } from "../executors";

@Injectable()
export class ProvidersDiscoveryService implements OnModuleInit {
    private readonly executorsMap: Map<InjectionToken, IExecutor<unknown>>;
    private readonly keyExtractorsMap: Map<InjectionToken, KeyExtractorFn>;
    private readonly errorFactoriesMap: Map<InjectionToken, ErrorFactoryFn>;
    private readonly optionsFactoriesMap: Map<InjectionToken, OptionsFactoryFn>;

    public constructor(@Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer) {}

    public onModuleInit() {
        for (const moduleInstance of this.modulesContainer.values()) {
            for (const provider of moduleInstance.providers.values()) {
                const token = provider.token;
                const instance = provider.instance;

                if (!instance) {
                    continue;
                }

                if (this.isExecutor(instance)) {
                    this.executorsMap.set(token, instance);
                }

                if (this.isKeyExtractor(instance)) {
                    this.keyExtractorsMap.set(token, (context) => instance.extract(context));
                }

                if (this.isErrorFactory(instance)) {
                    this.errorFactoriesMap.set(token, (context, options, key) => instance.getError(context, options, key));
                }

                if (this.isOptionsFactory(instance)) {
                    this.optionsFactoriesMap.set(token, (context) => instance.getOptions(context));
                }
            }
        }
    }

    private isExecutor(provider: any) {
        const methodKey = "check" satisfies keyof IExecutor<unknown>;

        return this.isValidProvider<IExecutor<unknown>>(provider, methodKey);
    }

    private isKeyExtractor(provider: any) {
        const methodKey = "extract" satisfies keyof IKeyExtractor;

        return this.isValidProvider<IKeyExtractor>(provider, methodKey);
    }

    private isErrorFactory(provider: any) {
        const methodKey = "getError" satisfies keyof IErrorFactory;

        return this.isValidProvider<IErrorFactory>(provider, methodKey);
    }

    private isOptionsFactory(provider: any) {
        const methodKey = "getOptions" satisfies keyof IOptionsFactory;

        return this.isValidProvider<IOptionsFactory>(provider, methodKey);
    }

    private isValidProvider<T>(provider: any, methodKey: string): provider is T {
        return provider && methodKey in provider && typeof provider[methodKey] === "function";
    }
}
