import { mock } from "bun:test";
import type { ILimiterStorage } from "../../../src/core/storage";

export function createStorageMock<State>() {
    return {
        type: mock((() => {}) as any),
        get: mock<ILimiterStorage<State>["get"]>((() => {}) as any),
        set: mock<ILimiterStorage<State>["set"]>((() => {}) as any)
    } satisfies Record<keyof ILimiterStorage<State>, unknown>;
}
