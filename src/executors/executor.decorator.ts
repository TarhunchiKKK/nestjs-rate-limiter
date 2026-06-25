/** biome-ignore-all lint/complexity/noBannedTypes: `Function` type is necessary for `reflect-metadata` library */
import { Injectable, type InjectableOptions } from "@nestjs/common";
import type { StorageTypes, Strategies } from "../shared/types";
import "reflect-metadata";

export const EXECUTOR_METADATA_KEY = "__executor__";

export type ExecutorOptions = {
    strategy: Strategies;
    storage: StorageTypes;
};

export function Executor(executorOptions: ExecutorOptions, injectionOptions?: InjectableOptions): ClassDecorator {
    return (target: Function) => {
        Injectable(injectionOptions)(target);

        Reflect.defineMetadata(EXECUTOR_METADATA_KEY, executorOptions, target);
    };
}
