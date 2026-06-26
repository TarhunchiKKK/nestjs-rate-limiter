import type { Provider } from "@nestjs/common";
import type { RateLimiterOptions } from "../options";
import { type IKeyExtractor } from "../../key-extractors";

export function getKeyExtractors(options: RateLimiterOptions): Provider<IKeyExtractor>[] {
    return options.custom?.keyExtractors ?? [];
}
