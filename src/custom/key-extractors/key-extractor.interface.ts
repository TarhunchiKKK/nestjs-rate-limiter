import type { ExecutionContext } from "@nestjs/common";
import type { Key } from "../../shared/model";

export interface IKeyExtractor {
    extract: (context: ExecutionContext) => Key | Promise<Key>;
}
