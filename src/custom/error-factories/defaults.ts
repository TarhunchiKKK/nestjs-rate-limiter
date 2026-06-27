import { ForbiddenException } from "@nestjs/common";
import type { ErrorFactoryFn } from "./types";

export const defaultErrorFactoryFn: ErrorFactoryFn = () => new ForbiddenException("Request limit exhausted");
