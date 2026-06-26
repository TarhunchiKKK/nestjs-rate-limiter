import type { Provider } from "@nestjs/common";
import type { IExecutor } from "../../executors";
import type { IKeyExtractor } from "../../key-extractors";
import type { ICleaner } from "../../cleaners";

export type CustomProvidersOptions = {
    executors?: Provider<IExecutor<unknown>>[];

    keyExtractors?: Provider<IKeyExtractor>[];

    cleaners?: Provider<ICleaner>[];

    logOverrides?: boolean;
};
