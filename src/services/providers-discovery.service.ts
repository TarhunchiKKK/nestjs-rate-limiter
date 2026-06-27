import { Inject, Injectable } from "@nestjs/common";
import type { IErrorFactory } from "../custom/error-factories";
import type { IKeyExtractor } from "../custom/key-extractors";
import type { IOptionsFactory } from "../custom/options-factories";
import { ERROR_FACTORIES_TOKEN, EXECUTORS_TOKEN, KEY_EXTRACTORS_TOKEN, OPTIONS_FACTORIES_TOKEN } from "../di";
import type { IExecutor } from "../executors";

@Injectable()
export class ProvidersDiscoveryService {
    public constructor(
        @Inject(EXECUTORS_TOKEN) private readonly executors: IExecutor<unknown>[],
        @Inject(KEY_EXTRACTORS_TOKEN) private readonly keyExtractors: IKeyExtractor[],
        @Inject(ERROR_FACTORIES_TOKEN) private readonly errorFacories: IErrorFactory[],
        @Inject(OPTIONS_FACTORIES_TOKEN) private readonly optionsFactories: IOptionsFactory[]
    ) {}
}
