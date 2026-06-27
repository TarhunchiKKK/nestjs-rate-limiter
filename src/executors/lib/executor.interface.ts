import type { Key } from "../shared/keys";

export interface IExecutor<Options> {
    check(key: Key, options: Options): boolean | Promise<boolean>;
}
