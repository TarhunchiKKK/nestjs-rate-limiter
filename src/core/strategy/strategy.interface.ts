import type { StrategyOptions, StrategyState } from "./types";

export interface ILimiterStrategy {
    isAllowed: (state: StrategyState, options: StrategyOptions) => boolean;
}
