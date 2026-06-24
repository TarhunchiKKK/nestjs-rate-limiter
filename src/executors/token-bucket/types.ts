export type TokenBucketOptions = {
    strategy: "token-bucket";
    capacity: number;
    refillRate: number;
    ttl: number;
};

export type TokenBucketState = {
    tokens: number;
    lastRefilled: number;
};
