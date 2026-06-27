import { InjectStorage } from "../../../di";
import type { Key } from "../../../shared/keys";
import { Executor, type IExecutor } from "../../lib";
import type { SlidingWindowCounterOptions, SlidingWindowCounterState } from "./types";

@Executor({ strategy: "sliding-window-counter", storage: "in-memory" })
export class SlidingWindowCounterInMemoryExecutor implements IExecutor<SlidingWindowCounterOptions> {
    public constructor(@InjectStorage() private readonly storage: Map<Key, SlidingWindowCounterState>) {}

    public check(key: Key, options: SlidingWindowCounterOptions) {
        const startTime = Date.now();

        const currentWindowStart = Math.floor(startTime / options.windowMs) * options.windowMs;

        const state = this.getState(key, currentWindowStart);

        this.checkPassedWindows(state, options, currentWindowStart);

        const calculatedWeightCount = this.calculateWeightCount(state, options, currentWindowStart, startTime);

        if (calculatedWeightCount < options.limit) {
            state.currentCount += 1;
            this.storage.set(key, state);
            return true;
        }

        return false;
    }

    private getState(key: Key, currentWindowStart: number) {
        let state = this.storage.get(key);

        if (!state) {
            state = {
                currentWindowStart: currentWindowStart,
                currentCount: 0,
                previousCont: 0
            };
        }

        return state;
    }

    private checkPassedWindows(state: SlidingWindowCounterState, options: SlidingWindowCounterOptions, currentWindowStart: number) {
        const timePassedSinceStoredWindow = currentWindowStart - state.currentWindowStart;

        if (timePassedSinceStoredWindow === options.windowMs) {
            state = {
                currentWindowStart: currentWindowStart,
                currentCount: 0,
                previousCont: state.currentCount
            };
        } else if (timePassedSinceStoredWindow > options.windowMs) {
            state = {
                currentWindowStart: currentWindowStart,
                currentCount: 0,
                previousCont: 0
            };
        }
    }

    private calculateWeightCount(state: SlidingWindowCounterState, options: SlidingWindowCounterOptions, currentWindowStart: number, startTime: number) {
        const timeElapsedInCurrentWindow = startTime - currentWindowStart;

        const previousWindowWeight = 1 - timeElapsedInCurrentWindow / options.windowMs;

        const calculatedWeightCount = state.currentCount + state.previousCont * previousWindowWeight;

        return calculatedWeightCount;
    }
}
