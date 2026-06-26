import { Reflector } from "@nestjs/core";

export const SkipRateLimitDecorator = Reflector.createDecorator<void>();
