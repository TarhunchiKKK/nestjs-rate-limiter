export type LeakyBucketOptions = {
    capacity: number;
    leakRate: number;
    ttl: number;
};

export type LeakyBucketState = {
    water: number;
    lastLeaked: number;
};
