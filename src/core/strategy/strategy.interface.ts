import type { LimiterOptions, LimiterState } from "../types";

export interface ILimiterStrategy {
    check: (state: LimiterState, options: LimiterOptions) => false | LimiterState;
    getDefaultState: (options: LimiterOptions) => LimiterState;
}
