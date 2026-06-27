import { applyDecorators } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { RateLimitNormalizedOptions, RateLimitOptions } from "../config/options";

export const RateLimitDecorator = Reflector.createDecorator<RateLimitNormalizedOptions>();

export function RateLimit(options: RateLimitOptions) {
    return applyDecorators(RateLimitDecorator(options ?? {}));
}
