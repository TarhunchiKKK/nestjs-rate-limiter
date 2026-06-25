import { Inject, Injectable } from "@nestjs/common";
import { IN_MEMORY_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import type { IExecutor } from "../executor.interface";
import type { SlidingWindowLogOptions, SlidingWindowLogState } from "./types";

@Injectable()
export class SlidingWindowLogInMemoryExecutor implements IExecutor<SlidingWindowLogOptions> {
    public constructor(@Inject(IN_MEMORY_STORAGE_TOKEN) private readonly storage: Map<Key, SlidingWindowLogState>) { }

    public check(key: Key, options: SlidingWindowLogOptions) {
        const now = Date.now();

        const timestamps = this.getRelevantTimestamps(key, options, now);

        if (timestamps.length < options.limit) {
            timestamps.push(now);
            this.storage.set(key, timestamps);
            return true;
        }

        this.storage.set(key, timestamps);

        return false;
    }

    private getRelevantTimestamps(key: Key, options: SlidingWindowLogOptions, startTime: number) {
        const clearBefore = startTime - options.windowMs;

        const timestamps = this.storage.get(key) ?? [];

        return timestamps.filter((timestamp) => timestamp > clearBefore);
    }
}
