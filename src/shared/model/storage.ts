import type Redis from "ioredis";
import type { Key } from "./keys";

export type StorageTypes = "in-memory" | "redis";

export type InMemoryStorage<Value> = Map<Key, Value>;

export type RedisStorage = Pick<Redis, "eval">;

export type Storage = InMemoryStorage<unknown> | RedisStorage;
