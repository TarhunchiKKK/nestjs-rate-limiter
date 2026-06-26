import type { Provider } from "@nestjs/common";
import { RedisCleaner, type ICleaner } from "../../cleaners";
import type { StorageTypes } from "../../shared/types";
import type { RateLimiterOptions } from "../options";

const builtinCleanersMap: Record<StorageTypes, Provider<ICleaner>[]> = {
    "in-memory": [],
    redis: [RedisCleaner]
};

export function getCleaners(options: RateLimiterOptions): Provider<ICleaner>[] {
    const builtinCleaners = builtinCleanersMap[options.limiter.storage] ?? [];

    const customCleaners = options.custom?.cleaners ?? [];

    return [...builtinCleaners, ...customCleaners];
}
