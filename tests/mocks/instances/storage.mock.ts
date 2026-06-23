import { mock } from "bun:test";
import type { ILimiterStorage } from "../../../src";

export function createStorageMock() {
    return {
        type: "mock",
        get: mock<ILimiterStorage["get"]>((() => { }) as any),
        set: mock<ILimiterStorage["set"]>((() => { }) as any)
    } satisfies Record<keyof ILimiterStorage, unknown>;
}
