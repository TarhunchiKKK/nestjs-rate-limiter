import { Inject } from "@nestjs/common";

export const EXECUTORS_TOKEN = Symbol();

export const KEY_EXTRACTORS_TOKEN = Symbol();

export const CLEANERS_TOKEN = Symbol();

export const STORAGE_TOKEN = Symbol();

export const OPTIONS_TOKEN = Symbol();

export function InjectStorage() {
    return Inject(STORAGE_TOKEN);
}
