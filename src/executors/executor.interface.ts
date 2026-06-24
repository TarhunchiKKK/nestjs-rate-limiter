import type { Key } from "../shared/keys";

export type StorageTypes = "in-memory" | "redis";

export type BaseOptions = {
    strategy: string;
    storageType: StorageTypes;
};

export interface IExecutor<Options = any> {
    readonly strategy: string;
    readonly storageType: StorageTypes;

    check(key: Key, options: Options): Promise<boolean>;
}
