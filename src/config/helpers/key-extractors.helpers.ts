import type { Provider } from "@nestjs/common";
import type { IKeyExtractor } from "../../key-extractors";
import type { RateLimiterOptions } from "../options";

export function getKeyExtractors(options: RateLimiterOptions): Provider<IKeyExtractor>[] {
    return options.keyExtractors?.custom ?? [];
}
