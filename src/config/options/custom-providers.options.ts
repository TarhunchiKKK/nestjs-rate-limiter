import type { Provider } from "@nestjs/common";
import type { IExecutor } from "../../executors";
import type { IKeyExtractor } from "../../key-extractors";

export type CustomProvidersOptions = {
    executors?: Provider<IExecutor<unknown>>[];

    keyExtractors?: Provider<IKeyExtractor>[];

    logOverrides?: boolean;
};
