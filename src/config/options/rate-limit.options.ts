import type { StrategyOptionsUnion } from "../../executors";
import type { DeepPartial, PartialUnionMembers } from "../../shared/lib";
import type { BaseOptions, ProvidersOptions, StrategyOptions } from "./common.options";

export type RateLimitOptions = Partial<BaseOptions> & Partial<ProvidersOptions> & PartialUnionMembers<StrategyOptionsUnion>;

// DELETE: is this typ necessary
export type RateLimitNormalizedOptions = Partial<BaseOptions> & Partial<ProvidersOptions> & DeepPartial<StrategyOptions>;
