import { type ExecutionContext, HttpException } from "@nestjs/common";
import { ErrorFactory, type ErrorFactoryOptions, type IErrorFactory } from "nestjs-rate-limiter";

export class CustomRateLimitError extends HttpException {
    public constructor(message: string) {
        super(message, 429);
    }
}

@ErrorFactory()
export class CustomErrorFactory implements IErrorFactory {
    public getError(context: ExecutionContext, options: ErrorFactoryOptions) {
        if (options.strategy === "leaky-bucket") {
            // BUG: type not autocompletes
            const a = options.strategyOptions;
        }
        return new CustomRateLimitError(`Rate limit exhausted on ${context.getType()} transporter for scope "${options.scope}" and key "${options.key}".`);
    }
}
