import { Executor, InjectStorage } from "../../decorators";
import type { Key } from "../../shared/keys";
import type { IExecutor } from "../executor.interface";
import type { TokenBucketOptions, TokenBucketState } from "./types";

type Options = TokenBucketOptions["in-memory"];

@Executor({ strategy: "token-bucket", storage: "in-memory" })
export class TokenBucketInMemoryExecutor implements IExecutor<Options> {
    public constructor(@InjectStorage() private readonly storage: Map<Key, TokenBucketState>) {}

    public check(key: Key, options: Options) {
        const state = this.storage.get(key);

        if (!state) {
            this.setInitialState(key, options);
            return true;
        }

        const { currentTokens, refilledAt } = this.refillTokens(state, options);

        if (currentTokens >= 1) {
            this.storage.set(key, {
                tokens: currentTokens - 1,
                lastRefilled: refilledAt
            });
            return true;
        }

        this.storage.set(key, {
            tokens: currentTokens,
            lastRefilled: refilledAt
        });

        return false;
    }

    private setInitialState(key: Key, options: Options) {
        const initialState: TokenBucketState = {
            tokens: options.capacity - 1,
            lastRefilled: Date.now()
        };

        this.storage.set(key, initialState);
    }

    private refillTokens(state: TokenBucketState, options: Options) {
        const now = Date.now();

        const elapsed = Math.max(now - state.lastRefilled);

        const refilledTokens = elapsed * options.refillRate;

        const currentTokens = Math.min(options.capacity, state.tokens + refilledTokens);

        return {
            currentTokens: currentTokens,
            refilledAt: now
        };
    }
}
