// REFACTOR: split options for in-memory and redis executors
export type FixedWindowOptions = {
    limit: number;
    ttl: number;
};

export type FixedWindowState = {
    count: number;
    resetTime: number;
};
