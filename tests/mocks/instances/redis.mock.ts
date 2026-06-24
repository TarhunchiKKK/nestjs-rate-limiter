import { mock } from "bun:test";
import type Redis from "ioredis";

export function createRedisMock() {
    return {
        eval: mock<Redis["eval"]>(() => Promise.resolve(null))
    };
}
