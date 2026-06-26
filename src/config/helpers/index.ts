import type { RateLimiterOptions } from "../options";
import { getCleaners } from "./cleaners.helpers";
import { getExecutors } from "./executors.helpers";
import { getKeyExtractors } from "./key-extractors.helpers";

export function getProviders(options: RateLimiterOptions) {
    const executors = getExecutors(options);

    const keyExtractors = getKeyExtractors(options);

    const cleaners = getCleaners(options);

    return { executors, keyExtractors, cleaners };
}
