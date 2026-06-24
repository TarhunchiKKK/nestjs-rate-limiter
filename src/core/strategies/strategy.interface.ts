import type { Key } from "../../shared/keys";

export interface ILimiterStrategy<Options> {
    check: (key: Key, options: Options) => boolean | Promise<boolean>;
}
