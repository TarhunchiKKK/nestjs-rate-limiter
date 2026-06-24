import { Inject, Injectable } from "@nestjs/common";
import { STORAGE_INJECTION_TOKEN } from "../../di/di.constants";
import type { Key } from "../../shared/keys";
import type { ILimiterStorage } from "../storage";
import type { FixedWindowStrategyOptions, FixedWindowStrategyState, LimiterOptions } from "../types";
import type { ILimiterStrategy } from "./strategy.interface";

@Injectable()
export class FixedWindowStrategy implements ILimiterStrategy {
    public constructor(@Inject(STORAGE_INJECTION_TOKEN) private readonly storage: ILimiterStorage<FixedWindowStrategyState>) {}

    public async check(key: Key, options: LimiterOptions) {
        if (options.strategy !== "fixed-window") {
            throw new Error("Incorrect options");
        }

        const state = await this.getState(key, options);

        if (state.count < options.limit) {
            await this.storage.set(key, {
                ...state,
                count: state.count + 1
            });

            return true;
        }

        return false;
    }

    private async getState(key: Key, options: FixedWindowStrategyOptions) {
        const state = await this.storage.get(key);

        if (!state || state.resetTime < Date.now()) {
            const defaultState = this.getDefaultState(options);

            await this.storage.set(key, defaultState);

            return defaultState;
        }

        return state;
    }

    private getDefaultState(options: FixedWindowStrategyOptions): FixedWindowStrategyState {
        return {
            count: 0,
            resetTime: Date.now() + options.ttl
        };
    }
}
