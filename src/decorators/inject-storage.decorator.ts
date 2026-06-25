import { Inject } from "@nestjs/common";
import { STORAGE_TOKEN } from "../di";

export function InjectStorage() {
    return Inject(STORAGE_TOKEN);
}
