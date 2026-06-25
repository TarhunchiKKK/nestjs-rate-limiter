import { Executor, InjectStorage } from "../../decorators";
import type { Key } from "../../shared/keys";
import type { IExecutor } from "../executor.interface";
import type { SlidingWindowLogOptions, SlidingWindowLogState } from "./types";

type Options = SlidingWindowLogOptions["in-memory"];

@Executor({ strategy: "sliding-window-log", storage: "in-memory" })
export class SlidingWindowLogInMemoryExecutor implements IExecutor<Options> {
    public constructor(@InjectStorage() private readonly storage: Map<Key, SlidingWindowLogState>) {}

    public check(key: Key, options: Options) {
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

    private getRelevantTimestamps(key: Key, options: Options, startTime: number) {
        const clearBefore = startTime - options.windowMs;

        const timestamps = this.storage.get(key) ?? [];

        return timestamps.filter((timestamp) => timestamp > clearBefore);
    }
}
