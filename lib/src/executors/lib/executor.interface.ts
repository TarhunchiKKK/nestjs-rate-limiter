import type { Key } from "../../shared/model";

export interface IExecutor<Options> {
    check(key: Key, options: Options): boolean | Promise<boolean>;
}
