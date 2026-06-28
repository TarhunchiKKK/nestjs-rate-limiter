import { AVAILABLE_EXECUTORS, EXECUTOR_METADATA_KEY, type ExecutorMetadata } from "../../executors";
import type { StorageTypes } from "../../shared/model";

export function getExecutorsByStorage(storage: StorageTypes) {
    return AVAILABLE_EXECUTORS.filter((executor) => {
        const metadata: ExecutorMetadata = Reflect.getMetadata(EXECUTOR_METADATA_KEY, executor);

        return metadata && metadata.storage === storage;
    });
}
