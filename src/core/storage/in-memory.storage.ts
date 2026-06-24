import { Injectable } from "@nestjs/common";
import type { Key } from "../../shared/keys";
import type { ILimiterStorage } from "./storage.interface";

@Injectable()
export class InMemoryStorage<State> implements ILimiterStorage<State> {
    public readonly type = "in-memory";

    private readonly map = new Map<Key, State>();

    public get(key: Key) {
        const state = this.map.get(key);

        if (!state) {
            return null;
        }

        return state as State;
    }

    public set(key: Key, state: State) {
        this.map.set(key, state);
    }
}
