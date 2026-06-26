import type { ExecutorMetadata } from "./executor.decorator";

export function getExecutorMapKey(metadata: ExecutorMetadata) {
    return `${metadata.strategy}:${metadata.storage}`;
}