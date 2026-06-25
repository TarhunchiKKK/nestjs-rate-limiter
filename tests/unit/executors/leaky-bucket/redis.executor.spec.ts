import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { REDIS_STORAGE_TOKEN } from "../../../../src/di/di.constants";
import { LeakyBucketRedisExecutor } from "../../../../src/executors";
import type { LeakyBucketOptions } from "../../../../src/executors/leaky-bucket/types";
import { clearMock, createRedisMock, MS_IN_MINUTE } from "../../../mocks";

describe("LeakyBucketRedisExecutor", () => {
    let executor: LeakyBucketRedisExecutor;
    const redisMock = createRedisMock();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LeakyBucketRedisExecutor,
                {
                    provide: REDIS_STORAGE_TOKEN,
                    useValue: redisMock
                }
            ]
        }).compile();

        executor = module.get(LeakyBucketRedisExecutor);
    });

    afterEach(() => {
        clearMock(redisMock);
    });

    it("should allow request", async () => {
        const key = crypto.randomUUID();
        const options: LeakyBucketOptions = {
            strategy: "leaky-bucket",
            capacity: 10,
            leakRate: 1 / MS_IN_MINUTE,
            ttl: 5 * MS_IN_MINUTE
        };

        redisMock.eval.mockResolvedValue(1);

        const result = await executor.check(key, options);

        expect(result).toBeTrue();
    });

    it("should disallow request", async () => {
        const key = crypto.randomUUID();
        const options: LeakyBucketOptions = {
            strategy: "leaky-bucket",
            capacity: 10,
            leakRate: 1 / MS_IN_MINUTE,
            ttl: 5 * MS_IN_MINUTE
        };

        redisMock.eval.mockResolvedValue(0);

        const result = await executor.check(key, options);

        expect(result).toBeFalse();
    });
});
