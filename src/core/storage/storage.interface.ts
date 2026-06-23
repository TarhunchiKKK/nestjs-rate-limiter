import type { Key } from "../../shared/keys";
import type { LimiterState } from "../types";

export type StorageTypes = "in-memory";

export interface ILimiterStorage {
    type: StorageTypes;

    get: <State extends LimiterState>(key: Key) => State | null | Promise<State | null>;

    set: <State extends LimiterState>(key: Key, state: State) => void | Promise<void>;
}
