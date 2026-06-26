import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { STORAGE_TOKEN } from "../../../../src/di";
import { TokenBucketInMemoryExecutor } from "../../../../src/executors";
import type { TokenBucketOptions, TokenBucketState } from "../../../../src/executors/token-bucket/types";
import { clearMock, createInMemoryStorageMock, MS_IN_MINUTE } from "../../../mocks";

describe("TokenBucketInMemoryExecutor", () => {
    let executor: TokenBucketInMemoryExecutor;
    const storageMock = createInMemoryStorageMock<TokenBucketState>();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TokenBucketInMemoryExecutor,
                {
                    provide: STORAGE_TOKEN,
                    useValue: storageMock
                }
            ]
        }).compile();

        executor = module.get(TokenBucketInMemoryExecutor);
    });

    afterEach(() => {
        clearMock(storageMock);
    });

    describe("allow request", () => {
        it("should find valid state", async () => {
            const key = crypto.randomUUID();
            const state: TokenBucketState = {
                tokens: 5,
                lastRefilled: Date.now() - MS_IN_MINUTE
            };
            const options: TokenBucketOptions["in-memory"] = {
                capacity: 10,
                refillRate: 1 / MS_IN_MINUTE // one per minute,
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeTrue();
        });

        it("should find state with last attempt", async () => {
            const key = crypto.randomUUID();
            const state: TokenBucketState = {
                tokens: 5,
                lastRefilled: Date.now() - MS_IN_MINUTE
            };
            const options: TokenBucketOptions["in-memory"] = {
                capacity: state.tokens + 1,
                refillRate: 1 / MS_IN_MINUTE // one per minute,
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeTrue();
        });

        it("should not found state", async () => {
            const key = crypto.randomUUID();
            const options: TokenBucketOptions["in-memory"] = {
                capacity: 10,
                refillRate: 1 / MS_IN_MINUTE // one per minute,
            };

            storageMock.get.mockReturnValue(undefined);

            const result = await executor.check(key, options);

            expect(result).toBeTrue();
        });
    });

    describe("disallow request", () => {
        it("should find state with zero tokens", async () => {
            const key = crypto.randomUUID();
            const state: TokenBucketState = {
                tokens: 0,
                lastRefilled: Date.now() - MS_IN_MINUTE
            };
            const options: TokenBucketOptions["in-memory"] = {
                capacity: 10,
                refillRate: 1 / (2 * MS_IN_MINUTE) // one per 2 minutes,
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeFalse();
        });
    });
});
