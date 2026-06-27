export type Strategies = "fixed-window" | "token-bucket" | "sliding-window-counter" | "sliding-window-log" | "leaky-bucket";

export type StorageTypes = "in-memory" | "redis";

export type Scope = string;

export const DEFAULT_SCOPE: Scope = "default-scope";
