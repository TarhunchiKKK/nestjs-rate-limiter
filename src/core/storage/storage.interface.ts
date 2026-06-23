import type { Key } from "../lib";
import type { LimiterState } from "../types";

export interface ILimiterStorage {
    get: (key: Key) => LimiterState | null | Promise<LimiterState | null>;

    set: (key: Key, state: LimiterState) => void | Promise<void>;
}
