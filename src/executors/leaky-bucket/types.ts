export type LeakyBucketOptions = {
    strategy: "leaky-bucket";
    capacity: number;
    leakRate: number;
    ttl: number;
};

export type LeakyBucketState = {
    water: number;
    lastLeaked: number;
};
