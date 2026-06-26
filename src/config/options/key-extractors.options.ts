import type { Type } from "@nestjs/common";
import type { KeyExtractorFn, IKeyExtractor } from "../../key-extractors";

export type KeyExtractorOptions = {
    default?: KeyExtractorFn | Type<IKeyExtractor>;
};
