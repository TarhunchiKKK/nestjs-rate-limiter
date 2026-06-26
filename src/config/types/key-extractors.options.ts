import type { KeyExtractorFn, IKeyExtractor } from "../../key-extractors";

export type KeyExtractorOptions = {
    default?: KeyExtractorFn | IKeyExtractor;
};
