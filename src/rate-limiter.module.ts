import { Module } from "@nestjs/common";
import { FixedWindowStrategy, InMemoryStorage } from "./core";
import { STORAGE_INJECTION_TOKEN } from "./di/di.constants";

@Module({
    providers: [
        FixedWindowStrategy,
        {
            provide: STORAGE_INJECTION_TOKEN,
            useClass: InMemoryStorage
        }
    ]
})
export class RateLimiterModule {}
