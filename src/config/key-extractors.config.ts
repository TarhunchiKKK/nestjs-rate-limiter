import type { Provider } from "@nestjs/common"
import type { KeyExtractorFn, IKeyExtractor } from "../key-extractors"

export type KeyExtractorOptions = {
    default?: KeyExtractorFn | IKeyExtractor

    custom?: Provider<IKeyExtractor>[]
}