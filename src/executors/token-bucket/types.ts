export type TokenBucketOptions = {
    capacity: number;
    refillRate: number;
};

export type TokenBucketState = {
    tokens: number;
    lastRefilled: number;
};
