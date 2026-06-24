import { mock } from "bun:test";
import type { ILimiterStorage } from "../../../src/core/storage";

export function createStorageMock<State>() {
    return {
        type: "mock",
        get: mock<ILimiterStorage<State>["get"]>(() => null),
        set: mock<ILimiterStorage<State>["set"]>(() => {})
    } satisfies Record<keyof ILimiterStorage<State>, unknown>;
}
