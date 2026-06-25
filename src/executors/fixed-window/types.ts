export type FixedWindowOptions = {
    "in-memory": {
        limit: number;
        ttl: number;
    };
    redis: {
        limit: number;
        ttl: number;
    };
};

export type FixedWindowState = {
    count: number;
    resetTime: number;
};
