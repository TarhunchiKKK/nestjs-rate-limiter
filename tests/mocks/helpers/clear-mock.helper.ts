import type { Mock } from "bun:test";

export function clearMock(mock: Record<string, Mock<any>>) {
    for (const key in mock) {
        mock[key]?.mockClear?.();
    }
}