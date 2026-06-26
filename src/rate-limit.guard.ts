import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { ProvidersLocator } from "./config/providers-locator.types";
import { RateLimit, type RateLimitBaseOptions, type RateLimitKeyExtractorOptions } from "./decorators";
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
        const options = this.reflector.get(RateLimit, context.getHandler());

        if (!options) {
            const strategyName = StrategiesRenamingMap[this.payload.defaults.strategy];
            const strategyOptions = this.payload.strategiesOptions[strategyName];

            return {
                extractKeyFn: this.payload.defaults.extractKeyFn,
                scope: this.payload.defaults.scope,
                error: this.payload.defaults.error,
                strategyOptions: {
                    ...strategyOptions,
                    strategy: this.payload.defaults.strategy
                } as StrategyOptionsUnion
            };
        }

        let extractKeyFn: KeyExtractorFn;
        if (("extractKeyFn" satisfies keyof Required<RateLimitKeyExtractorOptions>) in options) {
            extractKeyFn = options.extractKeyFn;
        } else if (("keyExtractor" satisfies keyof Required<RateLimitKeyExtractorOptions>) in options) {
            const classname = options.keyExtractor;
            const keyExtractorProvider = this.payload.providers.keyExtractors.get();
        }

        const { error, scope } = options;

        return {};
    }
}
