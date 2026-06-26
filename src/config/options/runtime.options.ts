import type { ICleaner } from "../../cleaners";
import type { IExecutor } from "../../executors";
import type { IKeyExtractor } from "../../key-extractors";
import type { ExecutorOptions } from "./executor.options";
import type { InjectionToken } from "@nestjs/common";

export type RuntimeOptions = {
    limiter: ExecutorOptions;

    executors: Map<InjectionToken, IExecutor<unknown>>;

    keyExtractors: Map<InjectionToken, IKeyExtractor>;

    cleaners: Map<InjectionToken, ICleaner>;
};
