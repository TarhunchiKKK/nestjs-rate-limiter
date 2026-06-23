import type { Key } from "../../shared";
import type { LimiterOptions } from "../types";

export interface ILimiterStrategy {
    check: (key: Key, options: LimiterOptions) => boolean | Promise<boolean>;
}
