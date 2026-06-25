export type LeakyBucketOptions = {
    "in-memory": {
        capacity: number;
        leakRate: number;
    };
    redis: {
        capacity: number;
        leakRate: number;
        ttl: number;
    };
};

export type LeakyBucketState = {
    water: number;
    lastLeaked: number;
};
