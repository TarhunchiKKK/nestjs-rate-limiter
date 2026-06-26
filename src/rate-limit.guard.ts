import type { InjectionToken } from "@nestjs/common";
import type { RateLimiterOptions } from "./config";
import type { IExecutor } from "./executors";
import type { IKeyExtractor, KeyExtractorFn } from "./key-extractors";

export type RateLimitGuardOptions = {
    limiter: RateLimiterOptions["limiter"];
    executors: {
        default: IExecutor<unknown>;
        all: Map<InjectionToken, IExecutor<unknown>>;
    };
    keyExtractors: {
        default: KeyExtractorFn | IKeyExtractor;
        all: Map<InjectionToken, IKeyExtractor>;
    };
};
