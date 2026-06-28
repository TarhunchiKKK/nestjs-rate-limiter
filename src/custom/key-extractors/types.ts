import type { ExecutionContext } from "@nestjs/common";
import type { Key } from "../../shared/model";

export type KeyExtractorFn = (context: ExecutionContext) => Key | Promise<Key>;

export interface IKeyExtractor {
    extract: KeyExtractorFn;
}
