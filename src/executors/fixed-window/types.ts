export type FixedWindowOptions = {
    strategy: "fixed-window";
    limit: number;
    ttl: number;
};

export type FixedWindowState = {
    count: number;
    resetTime: number;
};
