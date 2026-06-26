import type { RateLimiterOptions } from "../options";
import { getExecutors } from "./executors.helpers";
import { getKeyExtractors } from "./key-extractors.helpers";

export function getProviders(options: RateLimiterOptions) {
    const executors = getExecutors(options);

    const keyExtractors = getKeyExtractors(options);

    return { executors, keyExtractors };
}
