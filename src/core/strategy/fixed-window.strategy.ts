import type { ILimiterStrategy } from "./strategy.interface";
import type { StrategyOptions, StrategyState } from "./types";

export class FixedWindowStrategy implements ILimiterStrategy {
    public isAllowed(state: StrategyState, options: StrategyOptions) {
        if (state.strategy !== "fixed-window" || options.strategy !== "fixed-window") {
            throw new Error(`Incorrect strategy`);
        }

        return true;
    }
}
