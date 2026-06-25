import type { Key } from "../shared/keys";

export type Strategies = "fixed-window" | "token-bucket" | "sliding-window-counter"

export type StorageTypes = "in-memory" | "redis";

export type BaseOptions = {
    strategy: Strategies;
    storageType: StorageTypes;
};

export interface IExecutor<Options> {
    readonly strategy: Strategies;
    readonly storageType: StorageTypes;

    check(key: Key, options: Options): Promise<boolean>;
}
