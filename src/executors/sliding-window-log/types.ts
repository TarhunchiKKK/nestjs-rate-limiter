export type SlidingWindowLogOptions = {
    "in-memory": {
        limit: number;
        windowMs: number;
    };
    redis: {
        limit: number;
        windowMs: number;
    };
};

export type SlidingWindowLogState = number[];
