import type { ExecutionContext } from "@nestjs/common";
import type { Key } from "../shared/keys";

export interface IKeyExtractor {
    extractKey: (context: ExecutionContext) => Key | Promise<Key>;
}
