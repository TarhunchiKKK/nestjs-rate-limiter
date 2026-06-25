import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { IN_MEMORY_STORAGE_TOKEN } from "../../../../src/di/di.constants";
import { FixedWindowInMemoryExecutor } from "../../../../src/executors";
import type { FixedWindowOptions, FixedWindowState } from "../../../../src/executors/fixed-window/types";
import { clearMock, createInMemoryStorageMock, MS_IN_DAY, TOMORROW, YESTERDAY } from "../../../mocks";

describe("FixedWindowInMemoryExecutor", () => {
    let executor: FixedWindowInMemoryExecutor;
    const storageMock = createInMemoryStorageMock<FixedWindowState>();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FixedWindowInMemoryExecutor,
                {
                    provide: IN_MEMORY_STORAGE_TOKEN,
                    useValue: storageMock
                }
            ]
        }).compile();

        executor = module.get(FixedWindowInMemoryExecutor);
        // REFACTOR: add storageMock getting
    });

    afterEach(() => {
        clearMock(storageMock);
    });

    describe("allow request", () => {
        it("should find valid state", async () => {
            const key = crypto.randomUUID();
            const options: FixedWindowOptions = {
                strategy: "fixed-window",
                limit: 100,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowState = {
                count: 10,
                resetTime: TOMORROW
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeTrue();
        });

        it("should find state with resetTime left", async () => {
            const key = crypto.randomUUID();
            const options: FixedWindowOptions = {
                strategy: "fixed-window",
                limit: 100,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowState = {
                count: 10,
                resetTime: YESTERDAY
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeTrue();
        });

        it("should not found state", async () => {
            const key = crypto.randomUUID();
            const options: FixedWindowOptions = {
                strategy: "fixed-window",
                limit: 100,
                ttl: MS_IN_DAY
            };

            storageMock.get.mockReturnValue(undefined);

            const result = await executor.check(key, options);

            expect(result).toBeTrue();
        });
    });

    describe("disallow request", () => {
        it("should found state with limit === count", async () => {
            const key = crypto.randomUUID();
            const options: FixedWindowOptions = {
                strategy: "fixed-window",
                limit: 10,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowState = {
                count: 10,
                resetTime: TOMORROW
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeFalse();
        });

        it("should found state with limit <= count", async () => {
            const key = crypto.randomUUID();
            const options: FixedWindowOptions = {
                strategy: "fixed-window",
                limit: 10,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowState = {
                count: 20,
                resetTime: TOMORROW
            };

            storageMock.get.mockReturnValue(state);

            const result = await executor.check(key, options);

            expect(result).toBeFalse();
        });
    });
});
