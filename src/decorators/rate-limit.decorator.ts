import { applyDecorators } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { normalizeOptions } from "../config/helpers";
import type { RateLimitNormalizedOptions, RateLimitOptions } from "../config/options";

export const RateLimitDecorator = Reflector.createDecorator<RateLimitNormalizedOptions>();

export function RateLimit(options?: RateLimitOptions) {
    return applyDecorators(RateLimitDecorator(options ? normalizeOptions(options) : undefined));
}
