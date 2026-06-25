import type { ExecutionContext } from "@nestjs/common";
import type { Key } from "../shared/keys";

export type KeyExtractorFn = (context: ExecutionContext) => Key;
