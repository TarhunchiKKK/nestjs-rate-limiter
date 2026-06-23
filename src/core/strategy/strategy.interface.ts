import type { Key } from "../lib";
import type { LimiterOptions, LimiterState } from "../types";

export interface ILimiterStrategy {
    check: (key: Key, options: LimiterOptions) => boolean | Promise<boolean>;
    getDefaultState: (options: LimiterOptions) => LimiterState;
}
