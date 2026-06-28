import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { BaseOptions, RateLimitGuardOptions } from "../config/options";
import type { KeyExtractorFn } from "../custom/key-extractors";
import { RateLimitDecorator } from "../decorators";
import { GUARD_OPTIONS_TOKEN } from "../di";
import { StrategiesRenamingMap, type StrategyOptionsUnion } from "../executors";
import { ProvidersDiscoveryService } from "../services/providers-discovery.service";
import type { DeepRequired } from "../shared/ts";

type GetOptionsResult = {
    strategyOptions: StrategyOptionsUnion;

    extractKeyFn: KeyExtractorFn;
} & DeepRequired<BaseOptions>;

@Injectable()
export class RateLimitGuard implements CanActivate {
    public constructor(
        @Inject(GUARD_OPTIONS_TOKEN) private readonly options: RateLimitGuardOptions,
        @Inject(ProvidersDiscoveryService) private readonly discoveryService: ProvidersDiscoveryService,
        @Inject(Reflector) private readonly reflector: Reflector
    ) {}

    public async canActivate(context: ExecutionContext) {
        return true;
    }

    private getOptions(context: ExecutionContext): GetOptionsResult {
        const options = this.reflector.get(RateLimitDecorator, context.getHandler());

        if (!options) {
            const strategyName = StrategiesRenamingMap[this.options.strategy];
            const strategyOptions = this.options.strategyOptions[strategyName];

            return {
                scope: this.options.scope,
                // error: this.options.errorFactoryFn,
                extractKeyFn: this.options.keyExtractorFn,
                strategyOptions: {
                    ...strategyOptions,
                    strategy: this.options.strategy
                } as StrategyOptionsUnion
            };
        }

        let extractKeyFn: KeyExtractorFn;
        if (options.keyExtractor) {
            // FIX: key extractor class key getting
            const existingKeyExtractorFn = this.options.providers.keyExtractors.get(options.keyExtractor.name);

            if (!existingKeyExtractorFn) {
                throw new Error(`Cannot find key extractor class for ${options.keyExtractor}`);
            }

            extractKeyFn = existingKeyExtractorFn;
        } else if (options.keyExtractorFn) {
            extractKeyFn = options.keyExtractorFn;
        } else {
            extractKeyFn = this.options.keyExtractorFn;
        }

        if (!options.strategy) {
            const strategyName = StrategiesRenamingMap[this.options.strategy];
            const strategyOptions = this.options.strategyOptions[strategyName];

            return {
                scope: options.scope ?? this.options.scope,
                error: options.errorFactoryFn ?? this.options.errorFactoryFn,
                extractKeyFn: extractKeyFn,
                strategyOptions: {
                    ...strategyOptions,
                    strategy: this.options.strategy
                } as StrategyOptionsUnion
            };
        }

        const strategyName = StrategiesRenamingMap[options.strategy];
        const strategyOptions = this.options.strategyOptions[strategyName];

        return {
            scope: options.scope ?? this.options.scope,
            error: options.errorFactoryFn ?? this.options.errorFactoryFn,
            extractKeyFn: extractKeyFn,
            strategyOptions: {
                ...options.strategyOptions,
                ...strategyOptions,
                strategy: this.options.strategy
            } as StrategyOptionsUnion
        };
    }
}
