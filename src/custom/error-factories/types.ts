import type { ExecutionContext, Scope } from "@nestjs/common";
import type { StrategyOptionsUnion } from "../../executors";
import type { Key } from "../../shared/model";

export type ErrorFactoryOptions = {
    scope: Scope;

    strategyOptions: StrategyOptionsUnion;
};

export type ErrorFactoryFn = (context: ExecutionContext, options: ErrorFactoryOptions, key: Key) => Error | Promise<Error>;

export interface IErrorFactory {
    getError: ErrorFactoryFn;
}
