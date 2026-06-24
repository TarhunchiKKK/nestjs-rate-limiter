local now = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local refillRate = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

-- Get current state from Hash-table
local state = redis.call('hmget', KEYS[1], 'tokens', 'lastRefilled')
local tokens = tonumber(state[1])
local lastRefilled = tonumber(state[2])

-- No data -> create initial
if not tokens or not lastRefilled then
    tokens = capacity
    lastRefilled = now
end

-- Calculate accumulated tokens
local elapsed = now - lastRefilled
local refilledTokens = elapsed * refillRate
local currentTokens = math.min(capacity, tokens + refilledTokens)

if currentTokens >= 1 then
    -- Decrement token
    redis.call('hmset', KEYS[1], 'tokens', currentTokens - 1, 'lastRefilled', now)
    redis.call('pexpire', KEYS[1], ttl)
    return 1
else
    -- Set remaining tokens count (<= 1)
    redis.call('hmset', KEYS[1], 'tokens', currentTokens, 'lastRefilled', now)
    redis.call('pexpire', KEYS[1], ttl)
    return 0
end
