import { applyDecorators, UseGuards } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { RateLimitOptions } from "../config/options";
import { RateLimitGuard } from "../middleware";

export const RateLimitDecorator = Reflector.createDecorator<RateLimitOptions>();

export function RateLimit(options?: RateLimitOptions) {
    return applyDecorators(UseGuards(RateLimitGuard), RateLimitDecorator(options));
}
