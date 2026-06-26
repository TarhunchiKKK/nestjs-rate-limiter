import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { ProvidersLocator } from "./config/providers-locator.types";
import { type RateLimitBaseOptions, RateLimitDecorator } from "./decorators";
import { GUARD_PAYLOAD_TOKEN } from "./di";
import { type AllStrategiesOptions, type IExecutor, StrategiesRenamingMap, type StrategyOptionsUnion } from "./executors";
import type { KeyExtractorFn } from "./key-extractors";
import type { DeepRequired } from "./shared/ts";
import type { Strategies } from "./shared/types";

export type RateLimitGuardPayload = {
    defaults: DeepRequired<RateLimitBaseOptions> & {
        executor: IExecutor<unknown>;
        extractKeyFn: KeyExtractorFn;
        strategy: Strategies;
    };
    strategiesOptions: AllStrategiesOptions;
    providers: ProvidersLocator;
};

type GetOptionsResult = {
    strategyOptions: StrategyOptionsUnion;

    extractKeyFn: KeyExtractorFn;
} & DeepRequired<RateLimitBaseOptions>;

@Injectable()
export class RateLimitGuard implements CanActivate {
    public constructor(
        @Inject(GUARD_PAYLOAD_TOKEN) private readonly payload: RateLimitGuardPayload,
        @Inject(Reflector) private readonly reflector: Reflector
    ) {}

    public async canActivate(context: ExecutionContext) {
        return true;
    }

    private getOptions(context: ExecutionContext): GetOptionsResult {
        const options = this.reflector.get(RateLimitDecorator, context.getHandler());

        if (!options) {
            const strategyName = StrategiesRenamingMap[this.payload.defaults.strategy];
            const strategyOptions = this.payload.strategiesOptions[strategyName];

            return {
                scope: this.payload.defaults.scope,
                error: this.payload.defaults.error,
                extractKeyFn: this.payload.defaults.extractKeyFn,
                strategyOptions: {
                    ...strategyOptions,
                    strategy: this.payload.defaults.strategy
                } as StrategyOptionsUnion
            };
        }

        let extractKeyFn: KeyExtractorFn;
        if (options.keyExtractor) {
            // FIX: key extractor class key getting
            const existingKeyExtractorFn = this.payload.providers.keyExtractors.get(options.keyExtractor.name);

            if (!existingKeyExtractorFn) {
                throw new Error(`Cannot find key extractor class for ${options.keyExtractor}`);
            }

            extractKeyFn = existingKeyExtractorFn;
        } else if (options.extractKeyFn) {
            extractKeyFn = options.extractKeyFn;
        } else {
            extractKeyFn = this.payload.defaults.extractKeyFn;
        }

        if (!options.strategyOptions.strategy) {
            const strategyName = StrategiesRenamingMap[this.payload.defaults.strategy];
            const strategyOptions = this.payload.strategiesOptions[strategyName];

            return {
                scope: options.scope ?? this.payload.defaults.scope,
                error: options.error ?? this.payload.defaults.error,
                extractKeyFn: extractKeyFn,
                strategyOptions: {
                    ...strategyOptions,
                    strategy: this.payload.defaults.strategy
                } as StrategyOptionsUnion
            };
        }

        const strategyName = StrategiesRenamingMap[options.strategyOptions.strategy];
        const strategyOptions = this.payload.strategiesOptions[strategyName];

        return {
            scope: options.scope ?? this.payload.defaults.scope,
            error: options.error ?? this.payload.defaults.error,
            extractKeyFn: extractKeyFn,
            strategyOptions: {
                ...options.strategyOptions,
                ...strategyOptions,
                strategy: this.payload.defaults.strategy
            } as StrategyOptionsUnion
        };
    }
}
