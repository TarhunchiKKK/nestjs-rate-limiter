import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { REDIS_STORAGE_TOKEN } from "../../../../src/di/di.constants";
import { FixedWindowRedisExecutor } from "../../../../src/executors";
import type { FixedWindowOptions } from "../../../../src/executors/fixed-window/types";
import { clearMock, createRedisMock, MS_IN_DAY } from "../../../mocks";

describe("FixedWindowRedisExecutor", () => {
    let executor: FixedWindowRedisExecutor;
    const redisMock = createRedisMock();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FixedWindowRedisExecutor,
                {
                    provide: REDIS_STORAGE_TOKEN,
                    useValue: redisMock
                }
            ]
        }).compile();

        executor = module.get(FixedWindowRedisExecutor);
    });

    afterEach(() => {
        clearMock(redisMock);
    });

    it("should receive count < limit", async () => {
        const key = crypto.randomUUID();
        const options: FixedWindowOptions = {
            strategy: "fixed-window",
            limit: 100,
            ttl: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(options.limit - 1);

        const result = await executor.check(key, options);

        expect(result).toBeTrue();
    });

    it("should receive count === limit", async () => {
        const key = crypto.randomUUID();
        const options: FixedWindowOptions = {
            strategy: "fixed-window",
            limit: 100,
            ttl: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(options.limit);

        const result = await executor.check(key, options);

        expect(result).toBeFalse();
    });

    it("should receive count > limit", async () => {
        const key = crypto.randomUUID();
        const options: FixedWindowOptions = {
            strategy: "fixed-window",
            limit: 100,
            ttl: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(options.limit + 1);

        const result = await executor.check(key, options);

        expect(result).toBeFalse();
    });
});
