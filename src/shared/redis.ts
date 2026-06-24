import type { Key } from "./keys";

export const REDIS_PREFIX = "rate-limit";

export function getRedisKey(key: Key) {
    return `${REDIS_PREFIX}:${key}`;
}
