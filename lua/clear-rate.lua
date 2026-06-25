local cursor = "0"
local count = 0
local mask = ARGV[1]

repeat
    local res = redis.call('SCAN', cursor, 'MATCH', mask, 'count', 100)
    cursor = res[1]
    local keys = res[2]

    if #keys > 0 then
        redis.call('DEL', unpack(keys))
        count = count + #keys
    end
until cursor == "0"

return count