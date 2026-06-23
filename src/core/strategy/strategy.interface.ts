import type { Key } from "../lib";

export interface IRateLimitingStrategy<Arg> {
    isAllowed: (key: Key, arg: Arg) => boolean | Promise<boolean>;
}
