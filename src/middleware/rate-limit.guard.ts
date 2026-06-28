import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { normalizeOptions } from "../config/helpers";
import type {
    BaseOptions,
    ErrorFactoryOptions,
    KeyExtractorOptions,
    OptionsFactoryOptions,
    RateLimitGuardOptions,
    RateLimitNormalizedOptions,
    StrategyOptions
} from "../config/options";
import type { ErrorFactoryFn, ErrorOptions } from "../custom/error-factories";
import type { KeyExtractorFn } from "../custom/key-extractors";
import type { OptionsFactoryFn } from "../custom/options-factories";
import { RateLimitDecorator, SkipRateLimitDecorator } from "../decorators";
import { GUARD_OPTIONS_TOKEN } from "../di";
import { ProvidersDiscoveryService } from "../services/providers-discovery.service";
import type { FlattenOptionalNeverUnion } from "../shared/lib";
import { getKey } from "../shared/model";

type RunOptions = BaseOptions &
    StrategyOptions &
    Required<Pick<FlattenOptionalNeverUnion<KeyExtractorOptions>, "keyExtractorFn">> &
    Required<Pick<FlattenOptionalNeverUnion<ErrorFactoryOptions>, "errorFactoryFn">> &
    Pick<FlattenOptionalNeverUnion<OptionsFactoryOptions>, "factoryFn">;

@Injectable()
export class RateLimitGuard implements CanActivate {
    private defaultRunOptions?: RunOptions;

    public constructor(
        @Inject(GUARD_OPTIONS_TOKEN) private readonly options: RateLimitGuardOptions,
        @Inject(ProvidersDiscoveryService) private readonly discoveryService: ProvidersDiscoveryService,
        @Inject(Reflector) private readonly reflector: Reflector
    ) {}

    public async canActivate(context: ExecutionContext) {
        const skip = this.checkSkip(context);

        if (skip) {
            return true;
        }

        if (!this.defaultRunOptions) {
            this.defaultRunOptions = this.getDefaultRunOptions();
        }

        const options = await this.getRunOptions(context, this.defaultRunOptions);

        const key = options.keyExtractorFn(context);

        const requestAllowed = await this.checkRate(key, options);

        if (!requestAllowed) {
            const errorOptions: ErrorOptions = {
                key: key,
                scope: options.scope,
                strategy: options.strategy,
                strategyOptions: options.strategyOptions[options.strategy]
            };

            throw options.errorFactoryFn(context, errorOptions);
        }

        return true;
    }

    private checkSkip(context: ExecutionContext) {
        const shouldSkip = this.reflector.get(SkipRateLimitDecorator, context.getHandler());

        if (shouldSkip) {
            return true;
        }

        return false;
    }

    private async getRunOptions(context: ExecutionContext, defaultRunOptions: RunOptions): Promise<RunOptions> {
        const options = this.reflector.get(RateLimitDecorator, context.getHandler());

        if (!options) {
            return defaultRunOptions;
        }

        // get key extractor
        let keyExtractorFn: KeyExtractorFn;
        if (options.keyExtractor) {
            keyExtractorFn = this.discoveryService.getKeyExtractor(options.keyExtractor);
        } else if (options.keyExtractorFn) {
            keyExtractorFn = options.keyExtractorFn;
        } else {
            keyExtractorFn = defaultRunOptions.keyExtractorFn;
        }

        // get error factory
        let errorFactoryFn: ErrorFactoryFn;
        if (options.errorFactory) {
            errorFactoryFn = this.discoveryService.getErrorFactory(options.errorFactory);
        } else if (options.errorFactoryFn) {
            errorFactoryFn = options.errorFactoryFn;
        } else {
            errorFactoryFn = defaultRunOptions.errorFactoryFn;
        }

        // get options factory
        let optionsFactoryFn: OptionsFactoryFn | undefined;
        if (options.factory) {
            optionsFactoryFn = this.discoveryService.getOptionsFactory(options.factory);
        } else if (options.factoryFn) {
            optionsFactoryFn = options.factoryFn;
        } else {
            optionsFactoryFn = defaultRunOptions.factoryFn;
        }

        // merge dynamic options with
        const dynamicOptions = optionsFactoryFn ? await optionsFactoryFn(context) : {};

        const finalDecoratorOptions: RateLimitNormalizedOptions = {
            ...normalizeOptions(dynamicOptions),
            ...options
        };

        // there is non-default strategy in decorator options
        if (options.strategy) {
            return {
                scope: finalDecoratorOptions.scope ?? this.options.scope,
                keyExtractorFn: keyExtractorFn,
                errorFactoryFn: errorFactoryFn,
                factoryFn: optionsFactoryFn,
                strategy: options.strategy,
                strategyOptions: {
                    ...this.options.strategyOptions,
                    [options.strategy]: {
                        ...this.options.strategyOptions[options.strategy],
                        ...finalDecoratorOptions.strategyOptions?.[options.strategy]
                    }
                }
            };
        }

        // default strategy is used
        return {
            scope: finalDecoratorOptions.scope ?? this.options.scope,
            keyExtractorFn: keyExtractorFn,
            errorFactoryFn: errorFactoryFn,
            factoryFn: optionsFactoryFn,
            strategy: this.options.strategy,
            strategyOptions: this.options.strategyOptions
        };
    }

    private getDefaultRunOptions(): RunOptions {
        let keyExtractorFn: KeyExtractorFn;
        if (this.options.keyExtractor) {
            keyExtractorFn = this.discoveryService.getKeyExtractor(this.options.keyExtractor);
        } else if (this.options.keyExtractorFn) {
            keyExtractorFn = this.options.keyExtractorFn;
        } else {
            throw new Error(`Cannot resolve key extractor`);
        }

        let errorFactoryFn: ErrorFactoryFn;
        if (this.options.errorFactory) {
            errorFactoryFn = this.discoveryService.getErrorFactory(this.options.errorFactory);
        } else if (this.options.errorFactoryFn) {
            errorFactoryFn = this.options.errorFactoryFn;
        } else {
            throw new Error(`Cannot resolve error factory`);
        }

        let optionsFactoryFn: OptionsFactoryFn | undefined;
        if (this.options.factory) {
            optionsFactoryFn = this.discoveryService.getOptionsFactory(this.options.factory);
        } else if (this.options.factoryFn) {
            optionsFactoryFn = this.options.factoryFn;
        }

        return {
            scope: this.options.scope,
            strategy: this.options.strategy,
            strategyOptions: this.options.strategyOptions,
            keyExtractorFn: keyExtractorFn,
            errorFactoryFn: errorFactoryFn,
            factoryFn: optionsFactoryFn
        };
    }

    private async checkRate(key: unknown, options: RunOptions) {
        const finalKey = getKey(key, options.strategy, options.scope);

        const executor = this.discoveryService.getExecutor(options.strategy);

        return await executor.check(finalKey, options.strategyOptions[options.strategy]);
    }
}
