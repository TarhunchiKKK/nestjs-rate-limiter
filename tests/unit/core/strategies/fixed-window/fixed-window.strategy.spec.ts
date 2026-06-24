import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { FixedWindowStrategy, type LimiterOptions, type LimiterState } from "../../../../../src/core/strategies";
import type { FixedWindowStrategyState } from "../../../../../src/core/strategies/fixed-window/types";
import { STORAGE_INJECTION_TOKEN } from "../../../../../src/di/di.constants";
import { clearMock, createStorageMock, MS_IN_DAY, TOMORROW, YESTERDAY } from "../../../../mocks";

describe("FixedWindowStrategy", () => {
    let strategy: FixedWindowStrategy;
    const storageMock = createStorageMock<LimiterState>();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FixedWindowStrategy,
                {
                    provide: STORAGE_INJECTION_TOKEN,
                    useValue: storageMock
                }
            ]
        }).compile();

        strategy = module.get(FixedWindowStrategy);
    });

    afterEach(() => {
        clearMock(storageMock);
    });

    describe("allow request", () => {
        it("should find valid state", async () => {
            const key = crypto.randomUUID();
            const options: LimiterOptions = {
                strategy: "fixed-window",
                limit: 100,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowStrategyState = {
                count: 10,
                resetTime: TOMORROW
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeTrue();
        });

        it("should find state with resetTime left", async () => {
            const key = crypto.randomUUID();
            const options: LimiterOptions = {
                strategy: "fixed-window",
                limit: 100,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowStrategyState = {
                count: 10,
                resetTime: YESTERDAY
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeTrue();
        });

        it("should not found state", async () => {
            const key = crypto.randomUUID();
            const options: LimiterOptions = {
                strategy: "fixed-window",
                limit: 100,
                ttl: MS_IN_DAY
            };

            storageMock.get.mockReturnValue(null);

            const result = await strategy.check(key, options);

            expect(result).toBeTrue();
        });
    });

    describe("disallow request", () => {
        it("should found state with limit === count", async () => {
            const key = crypto.randomUUID();
            const options: LimiterOptions = {
                strategy: "fixed-window",
                limit: 10,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowStrategyState = {
                count: 10,
                resetTime: TOMORROW
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeFalse();
        });

        it("should found state with limit <= count", async () => {
            const key = crypto.randomUUID();
            const options: LimiterOptions = {
                strategy: "fixed-window",
                limit: 10,
                ttl: MS_IN_DAY
            };
            const state: FixedWindowStrategyState = {
                count: 20,
                resetTime: TOMORROW
            };

            storageMock.get.mockReturnValue(state);

            const result = await strategy.check(key, options);

            expect(result).toBeFalse();
        });
    });

    describe("receive incorrect options", () => {
        // TODO: implement after another state creation
    });
});
