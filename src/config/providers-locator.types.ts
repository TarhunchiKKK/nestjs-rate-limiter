import type { IExecutor } from "../executors";
import type { IKeyExtractor } from "../key-extractors";
import type { Key } from "../shared/keys";

export type ProvidersLocator = {
    executors: Map<Key, IExecutor<unknown>>;

    keyExtractors: Map<Key, IKeyExtractor>;
};
