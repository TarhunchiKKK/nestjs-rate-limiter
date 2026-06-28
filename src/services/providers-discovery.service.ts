import { Inject, Injectable, type InjectionToken, type OnModuleInit } from "@nestjs/common";
import { ModulesContainer, Reflector } from "@nestjs/core";
import { ERROR_FACTORY_METADATA, type ErrorFactoryFn, type IErrorFactory } from "../custom/error-factories";
import { type IKeyExtractor, KEY_EXTRACTOR_METADATA, type KeyExtractorFn } from "../custom/key-extractors";
import { type IOptionsFactory, OPTIONS_FACTORY_METADATA, type OptionsFactoryFn } from "../custom/options-factories";
import { EXECUTOR_METADATA_KEY, type IExecutor } from "../executors";

@Injectable()
export class ProvidersDiscoveryService implements OnModuleInit {
    private readonly executorsMap: Map<InjectionToken, IExecutor<unknown>>;
    private readonly keyExtractorsMap: Map<InjectionToken, KeyExtractorFn>;
    private readonly errorFactoriesMap: Map<InjectionToken, ErrorFactoryFn>;
    private readonly optionsFactoriesMap: Map<InjectionToken, OptionsFactoryFn>;

    public constructor(
        @Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer,
        @Inject(Reflector) private readonly reflector: Reflector
    ) {}

    public onModuleInit() {
        for (const moduleInstance of this.modulesContainer.values()) {
            for (const provider of moduleInstance.providers.values()) {
                const token = provider.token;
                const instance = provider.instance;

                if (!instance) {
                    continue;
                }

                if (this.isValidProvider<IExecutor<unknown>>(instance, "check", EXECUTOR_METADATA_KEY)) {
                    this.executorsMap.set(token, instance);
                }

                if (this.isValidProvider<IKeyExtractor>(instance, "extract", KEY_EXTRACTOR_METADATA)) {
                    this.keyExtractorsMap.set(token, (context) => instance.extract(context));
                }

                if (this.isValidProvider<IErrorFactory>(instance, "getError", ERROR_FACTORY_METADATA)) {
                    this.errorFactoriesMap.set(token, (context, options, key) => instance.getError(context, options, key));
                }

                if (this.isValidProvider<IOptionsFactory>(instance, "getOptions", OPTIONS_FACTORY_METADATA)) {
                    this.optionsFactoriesMap.set(token, (context) => instance.getOptions(context));
                }
            }
        }
    }

    private isValidProvider<T>(provider: any, methodKey: keyof T, metadataKey: string): provider is T {
        if (!provider?.constructor) {
            return false;
        }

        const hasMethod = methodKey in provider && typeof provider[methodKey] === "function";

        const hasMetadata = this.reflector.get(metadataKey, provider.constructor);

        return hasMethod && hasMetadata;
    }
}
