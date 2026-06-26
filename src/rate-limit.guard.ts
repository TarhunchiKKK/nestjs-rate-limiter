import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { ProvidersLocator } from "./config/providers-locator.types";
import type { RateLimitBaseOptions } from "./decorators";
import { GUARD_PAYLOAD_TOKEN } from "./di";
import type { AllStrategiesOptions, IExecutor } from "./executors";
import type { KeyExtractorFn } from "./key-extractors";
import type { DeepRequired } from "./shared/ts";

export type RateLimitGuardPayload = {
    limiter: DeepRequired<RateLimitBaseOptions>;
    strategiesOptions: AllStrategiesOptions;
    defaults: {
        executor: IExecutor<unknown>;
        extractKey: KeyExtractorFn;
    };
    providers: ProvidersLocator;
};

@Injectable()
export class RateLimitGuard implements CanActivate {
    public constructor(
        @Inject(GUARD_PAYLOAD_TOKEN) private readonly payload: RateLimitGuardPayload,
        @Inject(Reflector) private readonly reflector: Reflector
    ) {}

    public async canActivate(context: ExecutionContext) {
        return true;
    }
}
