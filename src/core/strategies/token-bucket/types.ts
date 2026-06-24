export type TokenBucketStrategyOptions = {
    // DELETE: this field is unused
    strategy: "token-bucket";
    capacity: number;
    refillRate: number;
};

export type TokenBucketStrategyState = {
    tokens: number;
    lastRefilled: number;
};
