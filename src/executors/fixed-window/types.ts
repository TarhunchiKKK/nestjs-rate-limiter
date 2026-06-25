// REFACTOR: split options for in-memory and redis executors
export type FixedWindowOptions = {
    // DELETE: this field is unused 
    strategy: "fixed-window";
    limit: number;
    ttl: number;
};

export type FixedWindowState = {
    count: number;
    resetTime: number;
};
