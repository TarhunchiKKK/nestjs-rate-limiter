/** biome-ignore-all lint/complexity/noBannedTypes: `Function` type is necessary for `reflect-metadata` library */
import { Injectable, type InjectableOptions } from "@nestjs/common";
import type { StorageTypes } from "../executors/executor.interface";
import "reflect-metadata";

export const CLEANER_METADATA_KEY = "__cleaner__";

export type CleanerOptions = {
    storage: StorageTypes;
};

export function Cleaner(cleanerOptions: CleanerOptions, injectionOptions?: InjectableOptions): ClassDecorator {
    return (target: Function) => {
        Injectable(injectionOptions)(target);

        Reflect.defineMetadata(CLEANER_METADATA_KEY, cleanerOptions, target);
    };
}
