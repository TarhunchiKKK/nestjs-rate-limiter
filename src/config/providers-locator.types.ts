import type { IExecutor } from "../executors";
import type { KeyExtractorFn } from "../key-extractors";
import type { Key } from "../shared/keys";

export type ProvidersLocator = {
    executors: Map<Key, IExecutor<unknown>>;

    keyExtractors: Map<string, KeyExtractorFn>;
};
