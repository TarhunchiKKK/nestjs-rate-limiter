local key = KEYS[1]
local ttl = ARGV[1]
local current = redis.call('incr', key)

if current == 1 then
    redis.call('pexpire', key, ttl)
end

return current
