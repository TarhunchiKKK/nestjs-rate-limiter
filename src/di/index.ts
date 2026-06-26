import { Inject } from "@nestjs/common";

export const KEY_EXTRACTORS_TOKEN = Symbol()

export const STORAGE_TOKEN = Symbol();

export function InjectStorage() {
    return Inject(STORAGE_TOKEN);
}
