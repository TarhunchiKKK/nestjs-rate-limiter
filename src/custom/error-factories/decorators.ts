import { Injectable, type InjectableOptions } from "@nestjs/common";
import "reflect-metadata";

export const ERROR_FACTORY_METADATA = "__rate_limiter_error_factory__";

export function ErrorFactory(options?: InjectableOptions): ClassDecorator {
    return (target) => {
        Injectable(options)(target);

        Reflect.defineMetadata(ERROR_FACTORY_METADATA, true, target);
    };
}
