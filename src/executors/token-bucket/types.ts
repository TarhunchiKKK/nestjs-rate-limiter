export type TokenBucketOptions = {
    capacity: number;
    refillRate: number;
    ttl: number;
};

export type TokenBucketState = {
    tokens: number;
    lastRefilled: number;
};
