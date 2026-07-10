import { InjectStorage } from "../../../di";
import type { InMemoryStorage, Key } from "../../../shared/model";
import { Executor, type IExecutor } from "../../lib";
import type { SlidingWindowLogOptions, SlidingWindowLogState } from "./types";

@Executor({ strategy: "sliding-window-log", storage: "in-memory" })
export class SlidingWindowLogInMemoryExecutor implements IExecutor<SlidingWindowLogOptions> {
    public constructor(@InjectStorage() private readonly storage: InMemoryStorage<SlidingWindowLogState>) {}

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
