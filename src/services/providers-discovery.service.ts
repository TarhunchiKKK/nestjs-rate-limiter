import { Inject, Injectable, type OnModuleInit, type Type } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core";
import type { ErrorFactoryFn, IErrorFactory } from "../custom/error-factories";
import type { IKeyExtractor, KeyExtractorFn } from "../custom/key-extractors";
import type { IOptionsFactory, OptionsFactoryFn } from "../custom/options-factories";
import type { IExecutor } from "../executors";
import type { TokenType } from "../shared/nestjs";

@Injectable()
export class ProvidersDiscoveryService implements OnModuleInit {
    private readonly executorsMap: Map<Type<IExecutor<unknown>> | TokenType, IExecutor<unknown>>;
    private readonly keyExtractorsMap: Map<Type<IKeyExtractor> | TokenType, KeyExtractorFn>;
    private readonly errorFacotiesMap: Map<Type<IErrorFactory> | TokenType, ErrorFactoryFn>;
    private readonly optionsFactoriesMap: Map<Type<IOptionsFactory> | TokenType, OptionsFactoryFn>;

    public constructor(@Inject(ModulesContainer) private readonly modulesContainer: ModulesContainer) {}

    public onModuleInit() {}

    private isExecutor(provider: any) {
        const methodKey = "check" satisfies keyof IExecutor<unknown>;

        return this.isValidProvider<IExecutor<unknown>>(provider, methodKey);
    }

    private isKeyExtractor(provider: any) {
        const methodKey = "extract" satisfies keyof IKeyExtractor;

        return this.isValidProvider<IKeyExtractor>(provider, methodKey);
    }

    private isErrorfatory(provider: any) {
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
