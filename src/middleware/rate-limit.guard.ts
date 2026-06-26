import type { InjectionToken } from "@nestjs/common";
import type { RateLimiterOptions } from "../config";
import type { IExecutor } from "../executors";
import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors";

export type RateLimitGuardOptions = {
    limiter: RateLimiterOptions["limiter"];

    executors: {
        default: IExecutor<unknown>;

        custom: Map<InjectionToken, IExecutor<unknown>>;
    }

    keyExtractors: {
        default: KeyExtractorFn | IKeyExtractor;

        custom: Map<InjectionToken, IKeyExtractor>
    }
}