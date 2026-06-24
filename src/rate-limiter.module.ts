import { Module } from "@nestjs/common";
import { InMemoryStorage } from "./core/storage";
import { FixedWindowStrategy } from "./core/strategies";
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
