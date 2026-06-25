import { Inject, Injectable } from "@nestjs/common";
import { IN_MEMORY_STORAGE_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import type { IExecutor } from "../executor.interface";
import type { LeakyBucketOptions, LeakyBucketState } from "./types";

@Injectable()
export class LeakyBucketInMemoryExecutor implements IExecutor<LeakyBucketOptions> {
    public constructor(@Inject(IN_MEMORY_STORAGE_TOKEN) private readonly storage: Map<Key, LeakyBucketState>) { }

    public check(key: Key, options: LeakyBucketOptions) {
        const startTime = Date.now();

        const state = this.storage.get(key);

        if (!state) {
            return this.handleNotExistingState(key, startTime);
        }

        const currentWater = this.getCurrentWater(state, options, startTime);

        if (currentWater + 1 <= options.capacity) {
            return this.handleNotFullBucket(key, currentWater, startTime);
        }

        return this.handleFullBucket(key, currentWater, startTime);
    }

    private handleNotExistingState(key: Key, startTime: number) {
        this.storage.set(key, {
            water: 1,
            lastLeaked: startTime
        });

        return true;
    }

    private getCurrentWater(state: LeakyBucketState, options: LeakyBucketOptions, startTime: number) {
        const elapsed = startTime - state.lastLeaked;

        const leakedWater = elapsed * options.leakRate;

        const currentWater = Math.max(0, state.water - leakedWater);

        return currentWater;
    }

    private handleNotFullBucket(key: string, currentWater: number, startTime: number) {
        this.storage.set(key, {
            water: currentWater + 1,
            lastLeaked: startTime
        });

        return true;
    }

    private handleFullBucket(key: string, currentWater: number, startTime: number) {
        this.storage.set(key, {
            water: currentWater,
            lastLeaked: startTime
        });

        return false;
    }
}
