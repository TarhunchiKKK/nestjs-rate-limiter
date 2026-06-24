import { beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { InMemoryStorage } from "../../../../src/core/storage";
import type { LimiterState } from "../../../../src/core/strategies";

describe("InMemoryStorage", () => {
    let storage: InMemoryStorage<LimiterState>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [InMemoryStorage]
        }).compile();

        storage = module.get(InMemoryStorage);
    });

    describe(".get", () => {
        it("should return existing state", () => {
            const key = crypto.randomUUID();
            const state: LimiterState = {
                count: 100,
                resetTime: Date.now()
            };

            storage.set(key, state);
            const result = storage.get(key);

            expect(result).toEqual(state);
        });

        it("should not found state", () => {
            const key = crypto.randomUUID();

            const result = storage.get(key);

            expect(result).toBeNull();
        });
    });

    describe(".set", () => {
        it("should save state", () => {
            const key = crypto.randomUUID();

            const state: LimiterState = {
                count: 100,
                resetTime: Date.now()
            };

            storage.set(key, state);
            const result = storage.get(key);

            expect(result).toEqual(state);
        });
    });
});
