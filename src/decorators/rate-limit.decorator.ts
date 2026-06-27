import { applyDecorators } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const RateLimitDecorator = Reflector.createDecorator<void>();

export function RateLimit() {
    return applyDecorators(RateLimitDecorator());
}
