import { Module } from "@nestjs/common";
import { FixedWindowStrategy, InMemoryStorage } from "../core";

@Module({
    providers: [InMemoryStorage, FixedWindowStrategy]
})
export class RateLimiterModule { }
