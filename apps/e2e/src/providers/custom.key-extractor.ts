import { type ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type IKeyExtractor, KeyExtractor } from "nestjs-rate-limiter";

@KeyExtractor()
export class CustomKeyExtractor implements IKeyExtractor {
    public constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    public extract(context: ExecutionContext) {
        const controller = context.getClass().name;

        const method = context.getHandler().name;

        const prefix = this.configService.getOrThrow("RATE_LIMIT_PREFIX");

        return `${prefix}-${controller}-${method}`;
    }
}
