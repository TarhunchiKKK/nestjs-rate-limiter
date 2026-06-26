export type Key = string;

export function getKey(key: unknown, strategy: string, scope: string = "default") {
    return `rate-limiter:${strategy}:${scope}:${key}`;
}
