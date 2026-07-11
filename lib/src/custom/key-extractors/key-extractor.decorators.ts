import { Injectable, type InjectableOptions } from "@nestjs/common";
import "reflect-metadata";

export const KEY_EXTRACTOR_METADATA = "__rate_limiter_key_extractor__";

export function KeyExtractor(options?: InjectableOptions): ClassDecorator {
    return (target) => {
        Injectable(options)(target);

        Reflect.defineMetadata(KEY_EXTRACTOR_METADATA, true, target);
    };
}
