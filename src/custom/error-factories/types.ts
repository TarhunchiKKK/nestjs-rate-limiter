import type { ExecutionContext } from "@nestjs/common";
import type { AllStrategiesOptions } from "../../executors";
import type { Scope, Strategies } from "../../shared/model";

export type ErrorOptions = {
    key: unknown;

    scope: Scope;

    strategy: Strategies;

    strategyOptions: AllStrategiesOptions[keyof AllStrategiesOptions];
};

export type ErrorFactoryFn = (context: ExecutionContext, options: ErrorOptions) => Error | Promise<Error>;

export interface IErrorFactory {
    getError: ErrorFactoryFn;
}
