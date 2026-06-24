import type { Key } from "../../shared/keys";

export type StorageTypes = "in-memory";

export interface ILimiterStorage<State> {
    type: StorageTypes;

    get: (key: Key) => State | null | Promise<State | null>;

    set: (key: Key, state: State) => void | Promise<void>;
}
