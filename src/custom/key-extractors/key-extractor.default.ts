import { BadRequestException, type ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import type { Request } from "express";
import { KeyExtractor } from "./key-extractor.decorators";
import type { IKeyExtractor } from "./key-extractor.interface";

@KeyExtractor()
export class BuiltinKeyExtractor implements IKeyExtractor {
    public extract(context: ExecutionContext) {
        if (context.getType() !== "http") {
            throw new BadRequestException(`Rate Limiter: Expected HTTP context, but found "${context.getType().toUpperCase()}"`);
        }

        const http = context.switchToHttp();

        const request: Request = http.getRequest();

        if (!request) {
            throw new InternalServerErrorException("Rate Limiter: Execution context don't contain HTTP request");
        }

        const xForwarderFor = request.headers["x-forwarded-for"];

        if (request.ip) {
            return request.ip;
        }

        if (xForwarderFor) {
            const ipString = Array.isArray(xForwarderFor) ? xForwarderFor[0] : xForwarderFor;

            const key = ipString?.split(",")[0]?.trim();

            if (key) {
                return key;
            }
        }

        throw new BadRequestException("Rate Limiter: Cannot extract HTTP request ip");
    }
}
