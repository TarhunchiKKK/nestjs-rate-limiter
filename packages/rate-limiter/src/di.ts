import { Inject } from "@nestjs/common";

export const STORAGE_TOKEN = Symbol();

export const GUARD_OPTIONS_TOKEN = Symbol();

export const MODULE_OPTIONS_TOKEN = Symbol();

export const KEY_EXTRACTORS_TOKEN = Symbol();

export const ERROR_FACTORIES_TOKEN = Symbol();

export const OPTIONS_FACTORIES_TOKEN = Symbol();

export function InjectStorage() {
    return Inject(STORAGE_TOKEN);
}
