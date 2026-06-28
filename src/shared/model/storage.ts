import type Redis from "ioredis";

export type StorageTypes = "in-memory" | "redis";

export type RedisStorage = Pick<Redis, "eval">;
