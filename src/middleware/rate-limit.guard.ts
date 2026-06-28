import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { RateLimitGuardOptions, RateLimitNormalizedOptions } from "../config/options";
import type { KeyExtractorFn } from "../custom/key-extractors";
import { RateLimitDecorator } from "../decorators";
import { GUARD_OPTIONS_TOKEN } from "../di";
import { ProvidersDiscoveryService } from "../services/providers-discovery.service";
import type { ErrorFactoryFn, ErrorFactoryOptions } from "../custom/error-factories";
import type { OptionsFactoryFn } from "../custom/options-factories";
import { normalizeOptions } from "../config/helpers";
import { getKey } from "../shared/model";

@Injectable()
export class RateLimitGuard implements CanActivate {
    public constructor(
        @Inject(GUARD_OPTIONS_TOKEN) private readonly options: RateLimitGuardOptions,
        @Inject(ProvidersDiscoveryService) private readonly discoveryService: ProvidersDiscoveryService,
        @Inject(Reflector) private readonly reflector: Reflector
    ) {}

    public async canActivate(context: ExecutionContext) {
        const options = await this.getOptions(context);

        const key = options.keyExtractorFn(context);

        const requestAllowed = await this.checkRate(key, options);

        if (!requestAllowed) {
            const errorOptions: ErrorFactoryOptions = {
                key: key,
                scope: options.scope,
                strategy: options.strategy,
                strategyOptions: options.strategyOptions[options.strategy]
            };

            throw options.errorFactoryFn(context, errorOptions);
        }

        return true;
    }

    private async getOptions(context: ExecutionContext): Promise<RateLimitGuardOptions> {
        const options = this.reflector.get(RateLimitDecorator, context.getHandler());

        if (!options) {
            return this.options;
        }

        // get key extractor
        let keyExtractorFn: KeyExtractorFn;
        if (options.keyExtractor) {
            keyExtractorFn = this.discoveryService.getKeyExtractor(options.keyExtractor);
        } else if (options.keyExtractorFn) {
            keyExtractorFn = options.keyExtractorFn;
        } else {
            keyExtractorFn = this.options.keyExtractorFn;
        }

        // get error factory
        let errorFactoryFn: ErrorFactoryFn;
        if (options.errorFactory) {
            errorFactoryFn = this.discoveryService.getErrorFactory(options.errorFactory);
        } else if (options.errorFactoryFn) {
            errorFactoryFn = options.errorFactoryFn;
        } else {
            errorFactoryFn = this.options.errorFactoryFn;
        }

        // get options factory
        let optionsFactoryFn: OptionsFactoryFn | undefined;
        if (options.factory) {
            optionsFactoryFn = this.discoveryService.getOptionsFactory(options.factory);
        } else if (options.factoryFn) {
            optionsFactoryFn = options.factoryFn;
        } else {
            optionsFactoryFn = this.options.factoryFn;
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

    private async checkRate(key: unknown, options: RateLimitGuardOptions) {
        const finalKey = getKey(key, options.strategy, options.scope);

        const executor = this.discoveryService.getExecutor(options.strategy);

        return await executor.check(finalKey, options.strategyOptions[options.strategy]);
    }
}
