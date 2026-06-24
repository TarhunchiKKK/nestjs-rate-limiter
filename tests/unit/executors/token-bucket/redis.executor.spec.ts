import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { REDIS_STORAGE_TOKEN } from "../../../../src/di/di.constants";
import { TokenBucketRedisExecutor } from "../../../../src/executors";
import type { TokenBucketOptions } from "../../../../src/executors/token-bucket/types";
import { clearMock, createRedisMock, MS_IN_DAY, MS_IN_MINUTE } from "../../../mocks";

describe("TokenBucketRedisExecutor", () => {
    let executor: TokenBucketRedisExecutor;
    const redisMock = createRedisMock();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TokenBucketRedisExecutor,
                {
                    provide: REDIS_STORAGE_TOKEN,
                    useValue: redisMock
                }
            ]
        }).compile();

        executor = module.get(TokenBucketRedisExecutor);
    });

    afterEach(() => {
        clearMock(redisMock);
    });

    it("should allow request", async () => {
        const key = crypto.randomUUID();
        const options: TokenBucketOptions = {
            strategy: "token-bucket",
            capacity: 10,
            refillRate: 1 / MS_IN_MINUTE,
            ttl: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(1);

        const result = await executor.check(key, options);

        expect(result).toBeTrue()
    });

    it("should disallow request", async () => {
        const key = crypto.randomUUID();
        const options: TokenBucketOptions = {
            strategy: "token-bucket",
            capacity: 10,
            refillRate: 1 / MS_IN_MINUTE,
            ttl: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(0);

        const result = await executor.check(key, options);

        expect(result).toBeFalse()
    });
});
