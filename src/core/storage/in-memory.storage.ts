import { Injectable } from "@nestjs/common";
import type { Key } from "../../shared/keys";
import type { LimiterState } from "../types";
import type { ILimiterStorage } from "./storage.interface";

@Injectable()
export class InMemoryStorage implements ILimiterStorage {
    public readonly type = "in-memory";

    private readonly map = new Map<Key, LimiterState>();

    public get<State extends LimiterState = LimiterState>(key: Key) {
        const state = this.map.get(key);

        if (!state) {
            return null;
        }

        return state as State;
    }

    public set<State extends LimiterState>(key: Key, state: State) {
        this.map.set(key, state);
    }
}
