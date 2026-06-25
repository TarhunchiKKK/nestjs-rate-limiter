export type TokenBucketOptions = {
    "in-memory": {
        capacity: number;
        refillRate: number;
    };
    redis: {
        capacity: number;
        refillRate: number;
        ttl: number;
    };
};

export type TokenBucketState = {
    tokens: number;
    lastRefilled: number;
};
