import type { ExecutionContext } from "@nestjs/common";
import type { StrategyOptionsUnion } from "../../executors";
import type { Key } from "../../shared/keys";
import type { Scope } from "../../shared/types";

export type ErrorFactoryOptions = {
    scope: Scope;

    strategyOptions: StrategyOptionsUnion;
};

export type ErrorFactoryFn = (context: ExecutionContext, options: ErrorFactoryOptions, key: Key) => Error | Promise<Error>;

export interface IErrorFactory {
    getError: ErrorFactoryFn;
}
