local key = KEYS[1]
local startTime = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local refillRate = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

-- Get current state from Hash-table
local state = redis.call('hmget', key, 'tokens', 'lastRefilled')
local tokens = tonumber(state[1])
local lastRefilled = tonumber(state[2])

-- No data -> create initial
if not tokens or not lastRefilled then
    tokens = capacity
    lastRefilled = startTime
end

-- Calculate accumulated tokens
local elapsed = startTime - lastRefilled
local refilledTokens = elapsed * refillRate
local currentTokens = math.min(capacity, tokens + refilledTokens)

if currentTokens >= 1 then
    -- Decrement token
    redis.call('hmset', key, 'tokens', currentTokens - 1, 'lastRefilled', startTime)
    redis.call('pexpire', key, ttl)
    return 1
else
    -- Set remaining tokens count (<= 1)
    redis.call('hmset', key, 'tokens', currentTokens, 'lastRefilled', startTime)
    redis.call('pexpire', key, ttl)
    return 0
end
