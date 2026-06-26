import type { Provider, Type } from "@nestjs/common";
import type { IKeyExtractor, KeyExtractorFn } from "../../key-extractors";

export type KeyExtractorOptions = {
    default?: KeyExtractorFn | Type<IKeyExtractor>;

    custom: Provider<IKeyExtractor>[];
};
