import { InjectStorage } from "../../../di";
import type { Key } from "../../../shared/model";
import { Executor, type IExecutor } from "../../lib";
import type { FixedWindowOptions, FixedWindowState } from "./types";

@Executor({ strategy: "fixed-window", storage: "in-memory" })
export class FixedWindowInMemoryExecutor implements IExecutor<FixedWindowOptions> {
    public constructor(@InjectStorage() private readonly storage: Map<Key, FixedWindowState>) {}

    public check(key: Key, options: FixedWindowOptions) {
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
