import { HttpException } from "@nestjs/common";
import type { IErrorFactory } from "./error-factory.interface";

export class BuiltinErrorFactory implements IErrorFactory {
    public getError() {
        return new HttpException("Too many requests.", 429);
    }
}
