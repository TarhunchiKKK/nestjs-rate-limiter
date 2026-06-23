import type { Key } from "../lib";
import type { IRateLimitingStrategy } from "./strategy.interface";

type Options = {
    limit: number;

    ttl: number;
};

export class FixedWindowStrategy implements IRateLimitingStrategy<Options> {
    public isAllowed(key: Key, options: Options) {
        return true;
    }
}
