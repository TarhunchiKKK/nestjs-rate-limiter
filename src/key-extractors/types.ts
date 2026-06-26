import type { ExecutionContext } from "@nestjs/common";
import type { Key } from "../shared/keys";

// REFACTOR: rename into `ExtractKeyFn`
export type KeyExtractorFn = (context: ExecutionContext) => Key;
