import { Inject, Injectable } from "@nestjs/common";
import { STORAGE_INJECTION_TOKEN } from "../../../di/di.constants";
import type { Key } from "../../../shared/keys";
import type { ILimiterStorage } from "../../storage";
import type { ILimiterStrategy } from "../strategy.interface";
import { refillTokens } from "./lib";
import type { TokenBucketStrategyOptions, TokenBucketStrategyState } from "./types";

@Injectable()
export class TokenBucketStrategy implements ILimiterStrategy<TokenBucketStrategyOptions> {
    public constructor(@Inject(STORAGE_INJECTION_TOKEN) private readonly storage: ILimiterStorage<TokenBucketStrategyState>) {}

    public async check(key: Key, options: TokenBucketStrategyOptions) {
        const state = await this.getState(key, options);

        const { currentTokens, refilledAt } = refillTokens(state, options);

        if (currentTokens >= 1) {
            await this.storage.set(key, {
                tokens: currentTokens - 1,
                lastRefilled: refilledAt
            });

            return true;
        }

        await this.storage.set(key, {
            tokens: currentTokens,
            lastRefilled: refilledAt
        });

        return false;
    }

    private async getState(key: Key, options: TokenBucketStrategyOptions): Promise<TokenBucketStrategyState> {
        const state = await this.storage.get(key);

        if (!state) {
            return {
                tokens: options.capacity,
                lastRefilled: Date.now()
            };
        }

        return state;
    }
}
