import { Injectable, type InjectableOptions } from "@nestjs/common";
import "reflect-metadata";

export const OPTIONS_FACTORY_METADATA = "__rate_limiter_options_factory__";

export function OptionsFactory(options?: InjectableOptions): ClassDecorator {
    return (target) => {
        Injectable(options)(target);

        Reflect.defineMetadata(OPTIONS_FACTORY_METADATA, true, target);
    };
}
