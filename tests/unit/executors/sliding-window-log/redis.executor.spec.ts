import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { STORAGE_TOKEN } from "../../../../src/di/tokens";
import { SlidingWindowLogRedisExecutor } from "../../../../src/executors";
import type { SlidingWindowLogOptions } from "../../../../src/executors/sliding-window-log/types";
import { clearMock, createRedisMock, MS_IN_DAY } from "../../../mocks";

describe("SlidingWindowLogRedisExecutor", () => {
    let executor: SlidingWindowLogRedisExecutor;
    const redisMock = createRedisMock();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SlidingWindowLogRedisExecutor,
                {
                    provide: STORAGE_TOKEN,
                    useValue: redisMock
                }
            ]
        }).compile();

        executor = module.get(SlidingWindowLogRedisExecutor);
    });

    afterEach(() => {
        clearMock(redisMock);
    });

    it("should allow request", async () => {
        const key = crypto.randomUUID();
        const options: SlidingWindowLogOptions["redis"] = {
            limit: 100,
            windowMs: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(1);

        const result = await executor.check(key, options);

        expect(result).toBeTrue();
    });

    it("should disallow request", async () => {
        const key = crypto.randomUUID();
        const options: SlidingWindowLogOptions["redis"] = {
            limit: 100,
            windowMs: MS_IN_DAY
        };

        redisMock.eval.mockResolvedValue(1);

        const result = await executor.check(key, options);

        expect(result).toBeFalse();
    });
});
