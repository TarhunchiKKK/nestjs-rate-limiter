import { describe, expect } from "bun:test";
import { it } from "node:test";
import type { RateLimiterModuleOptions } from "../../../src";
import { mergeDefaultOptions } from "../../../src/config/defaults";
import { DEFAULT_SCOPE } from "../../../src/shared/model";

describe("mergeDefaultOptions", () => {
    describe("scope", () => {
        it("default", () => {
            const input = {
                storage: "in-memory"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.scope).toBe(DEFAULT_SCOPE);
        });

        it("custom", () => {
            const input = {
                storage: "in-memory",
                scope: "custom-scope"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.scope).toBe(input.scope);
        });
    });

    describe("storage", () => {
        it("in-memory storage", () => {
            const input = {
                storage: "in-memory"
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.storage).toBe(input.storage);
        });

        it("redis storage", () => {
            const input = {
                storage: "redis",
                instance: {
                    eval: () => Promise.resolve(1)
                }
            } satisfies RateLimiterModuleOptions;

            const result = mergeDefaultOptions(input);

            expect(result.storage).toBe(input.storage);
            // biome-ignore lint/complexity/useLiteralKeys: This property is not visible for TypeScript
            expect(result["instance"]).toEqual(input.instance);
        });
    });

    describe("strategy", () => {
        it("default", () => {});

        it("custom", () => {});

        it("strategy options", () => {});
    });

    describe("providers", () => {
        it("default", () => {});

        it("custom", () => {});
    });
});
