import type { Strategies } from "../../shared/types";
import type { AllStrategiesOptions } from "./types";

export const StrategiesRenamingMap: Record<Strategies, keyof AllStrategiesOptions> = {
    "fixed-window": "fixedWindow",
    "token-bucket": "tokenBucket",
    "sliding-window-counter": "slidingWindowCounter",
    "sliding-window-log": "slidingWindowLog",
    "leaky-bucket": "leakyBucket"
};
