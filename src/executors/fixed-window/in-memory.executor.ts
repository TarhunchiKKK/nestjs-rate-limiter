import { Inject, Injectable } from "@nestjs/common";
import { IN_MEMORY_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import type { IExecutor, StorageTypes, Strategies } from "../executor.interface";
import type { FixedWindowOptions, FixedWindowState } from "./types";

@Injectable()
export class FixedWindowInMemoryExecutor implements IExecutor<FixedWindowOptions> {
    public readonly strategy: Strategies = "fixed-window";
    public readonly storageType: StorageTypes = "in-memory";

    public constructor(@Inject(IN_MEMORY_STORAGE_TOKEN) private readonly storage: Map<Key, FixedWindowState>) { }

    public async check(key: Key, options: FixedWindowOptions) {
        const now = Date.now();

        let state = this.storage.get(key);

        if (!state || state.resetTime < now) {
            state = {
                count: 0,
                resetTime: now + options.ttl
            };
        }

        if (state.count < options.limit) {
            state.count += 1;
            this.storage.set(key, state);
            return true;
        }

        return false;
    }
}
