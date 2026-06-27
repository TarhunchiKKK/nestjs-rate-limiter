import type { DeepRequired, FlattenOptionalNeverUnion } from "../../shared/ts";
import type {
    BaseOptions,
    CustomProvidersOptions,
    ErrorFactoryOptions,
    KeyExtractorOptions,
    OptionsFactoryOptions,
    StorageOptions,
    StrategyOptions
} from "../options";

export type DefaultOptions = BaseOptions &
    StorageOptions &
    StrategyOptions &
    KeyExtractorOptions &
    ErrorFactoryOptions &
    Partial<FlattenOptionalNeverUnion<OptionsFactoryOptions>> &
    DeepRequired<CustomProvidersOptions>;
