export type FixedWindowOptions = {
    limit: number;
    ttl: number;
};

export type FixedWindowState = {
    count: number;
    resetTime: number;
};
