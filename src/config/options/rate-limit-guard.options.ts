import type { FlattenOptionalNeverUnion } from "../../shared/lib";
import type { BaseOptions, ErrorFactoryOptions, KeyExtractorOptions, OptionsFactoryOptions, StrategyOptions } from "./common.options";

export type RateLimitGuardOptions = BaseOptions &
    StrategyOptions &
    Required<Pick<FlattenOptionalNeverUnion<KeyExtractorOptions>, "keyExtractorFn">> &
    Required<Pick<FlattenOptionalNeverUnion<ErrorFactoryOptions>, "errorFactoryFn">> &
    Required<Pick<FlattenOptionalNeverUnion<OptionsFactoryOptions>, "factoryFn">>;
