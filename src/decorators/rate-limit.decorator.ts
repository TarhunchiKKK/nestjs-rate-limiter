import { Reflector } from "@nestjs/core";
import type { RateLimitOptions } from "../config/options";

export const RateLimit = Reflector.createDecorator<RateLimitOptions>();
