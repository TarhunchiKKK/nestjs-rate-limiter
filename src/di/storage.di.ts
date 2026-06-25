import { Inject } from "@nestjs/common";

export const STORAGE_TOKEN = Symbol();

export function InjectStorage() {
    return Inject(STORAGE_TOKEN);
}
