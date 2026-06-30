import { type ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type IOptionsFactory, OptionsFactory } from "nestjs-rate-limiter";

@OptionsFactory()
export class CustomOptionsFactory implements IOptionsFactory {
    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) { }

    public getOptions(context: ExecutionContext) {
        const scope = this.configService.getOrThrow("RATE_LIMIT_SCOPE");

        return {
            // BUG: return inferred as any 
            scope: scope
        }
    }
}
