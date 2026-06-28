import { applyDecorators } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const SkipRateLimitDecorator = Reflector.createDecorator<true>();

export function SkipRateLimit() {
    return applyDecorators(SkipRateLimitDecorator(true));
}
