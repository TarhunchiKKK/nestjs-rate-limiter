import { describe, expect, it } from "bun:test";
import { DEFAULT_SCOPE, getKey } from "../../../src/shared/model";

describe("getKey", () => {
    it("with provided scope", () => {
        const input = {
            key: "key",
            strategy: "token-bucket",
            scope: "custom-scope"
        };

        const output = "rate-limiter:token-bucket:key:custom-scope";

        const result = getKey(input.key, input.strategy, input.scope);

        expect(result).toBe(output);
    });

    it("with default scope", () => {
        const input = {
            key: "key",
            strategy: "token-bucket"
        };

        const output = `rate-limiter:token-bucket:key:${DEFAULT_SCOPE}`;

        const result = getKey(input.key, input.strategy);

        expect(result).toBe(output);
    });
});
