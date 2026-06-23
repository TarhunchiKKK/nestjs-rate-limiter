import { Injectable } from "@nestjs/common";
import type { Key } from "../lib";
import type { LimiterStrategy } from "../strategy";
import type { LimiterOptions, LimiterState } from "../types";
import type { ILimiterStorage } from "./storage.interface";

@Injectable()
export class InMemoryStorage implements ILimiterStorage {
    private readonly storage = new Map<Key, LimiterState>();

    public constructor(private readonly strategy: LimiterStrategy) {}

    public isAllowed(key: Key, options: LimiterOptions) {
        const state = this.get(key);

        if (state) {
            return this.strategy.check(state, options);
        }

        const defaultState = this.strategy.getDefaultState(options);

        this.set(key, defaultState);

        return this.strategy.check(defaultState, options);
    }

    public get(key: Key) {
        return this.storage.get(key) ?? null;
    }

    public set(key: Key, state: LimiterState) {
        this.storage.set(key, state);
    }
}
