import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { type LimiterState, TokenBucketStrategy } from "../../../../../src/core/strategies";
import type { TokenBucketStrategyOptions, TokenBucketStrategyState } from "../../../../../src/core/strategies/token-bucket/types";
import { STORAGE_INJECTION_TOKEN } from "../../../../../src/di/di.constants";
import { clearMock, createStorageMock, MS_IN_MINUTE } from "../../../../mocks";

describe("TokenBucketStrategy", () => {
    let strategy: TokenBucketStrategy;
    const storageMock = createStorageMock<LimiterState>();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TokenBucketStrategy,
                {
                    provide: STORAGE_INJECTION_TOKEN,
                    useValue: storageMock
                }
            ]
        }).compile();

        strategy = module.get(TokenBucketStrategy);
    });

    afterEach(() => {
        clearMock(storageMock);
    });

    describe("allow request", () => {
        it("should find valid state", async () => {
            const key = crypto.randomUUID();
            const state: TokenBucketStrategyState = {
                tokens: 5,
                lastRefilled: Date.now() - MS_IN_MINUTE
            };
            const options: TokenBucketStrategyOptions = {
                strategy: "token-bucket",
                capacity: 10,
                refillRate: 1 / MS_IN_MINUTE // one per minute
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeTrue();
        });

        it("should find state with last attempt", async () => {
            const key = crypto.randomUUID();
            const state: TokenBucketStrategyState = {
                tokens: 5,
                lastRefilled: Date.now() - MS_IN_MINUTE
            };
            const options: TokenBucketStrategyOptions = {
                strategy: "token-bucket",
                capacity: state.tokens + 1,
                refillRate: 1 / MS_IN_MINUTE // one per minute
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeTrue();
        });

        it("should not found state", async () => {
            const key = crypto.randomUUID();
            const options: TokenBucketStrategyOptions = {
                strategy: "token-bucket",
                capacity: 10,
                refillRate: 1 / MS_IN_MINUTE // one per minute
            };

            storageMock.get.mockReturnValue(null);

            const result = await strategy.check(key, options);

            expect(result).toBeTrue();
        });
    });

    describe("disallow request", () => {
        it("should find state with zero tokens", async () => {
            const key = crypto.randomUUID();
            const state: TokenBucketStrategyState = {
                tokens: 0,
                lastRefilled: Date.now() - MS_IN_MINUTE
            };
            const options: TokenBucketStrategyOptions = {
                strategy: "token-bucket",
                capacity: 10,
                refillRate: 1 / (2 * MS_IN_MINUTE) // one per 2 minutes
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeFalse();
        });
    });
});
