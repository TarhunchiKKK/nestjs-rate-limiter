import { type DynamicModule, Module } from "@nestjs/common";
import type { RateLimiterModuleOptions } from "./config/options";
import { ProvidersDiscoveryService } from "./services/providers-discovery.service";

@Module({
    providers: [ProvidersDiscoveryService]
})
export class RateLimiterModule {
    public static forRoot(_: RateLimiterModuleOptions): DynamicModule {
        return {
            global: true,
            module: RateLimiterModule,
            providers: []
        };
    }
}
