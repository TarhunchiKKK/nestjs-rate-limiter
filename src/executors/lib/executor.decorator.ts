import { Injectable, type InjectableOptions } from "@nestjs/common";
import type { StorageTypes, Strategies } from "../../shared/types";
import "reflect-metadata";

export const EXECUTOR_METADATA_KEY = "__rate_limiter_executor__";

export type ExecutorMetadata = {
    strategy: Strategies;

    storage: StorageTypes;
};

export function Executor(metadata: ExecutorMetadata, options?: InjectableOptions): ClassDecorator {
    return (target) => {
        Injectable(options)(target);

        Reflect.defineMetadata(EXECUTOR_METADATA_KEY, metadata, target);
    };
}
