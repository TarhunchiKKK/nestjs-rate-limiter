import type { LimiterOptions, LimiterState } from "../types";
import type { FixedWindowStrategyOptions, FixedWindowStrategyState } from "../types/fixed-window.types";
import type { ILimiterStrategy } from "./strategy.interface";

export class FixedWindowStrategy implements ILimiterStrategy {
    public check(state: LimiterState, options: LimiterOptions) {
        if (state.strategy !== "fixed-window" || options.strategy !== "fixed-window") {
            throw new Error(`Incorrect strategy`);
        }

        return false as const;
    }

    public getDefaultState(options: FixedWindowStrategyOptions): FixedWindowStrategyState {
        return {
            count: options.limit,
            resetTime: Date.now() + options.ttl,
            strategy: "fixed-window"
        };
    }
}
