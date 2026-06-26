import type { IKeyExtractor, KeyExtractorFn } from "../key-extractors"
import type { StorageTypes, Strategies } from "../shared/types"



export type RateLimiterOptions = {
    limiter: {
        strategy: {
            type: Strategies
        }
        storage: {
            type: StorageTypes
        }
        customExecutors: [],
        logOverWrights: boolean;
    }

    cleaner: {
        default: {
            throwOnError: boolean
            enabled: boolean
        }
        customCleaners: [],
        logOverWrights: []
    }

    keyExtractors: {
        default: KeyExtractorFn | IKeyExtractor
        custom: []
    }
}