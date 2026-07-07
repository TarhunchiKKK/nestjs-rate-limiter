<p align="center">
    <a href="http://nestjs.com/" target="blank">
        <img src="https://docs.nestjs.com/assets/logo-small-gradient.svg" width="250" alt="Nest Logo" />
    </a>
    <p align="center">
        A rate limiter module for <a href="http://nestjs.com/">NestJS</a> framework (Node.js).
    </p>
</p>

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Module Configuration](#module-configuration)
  - [Default Module Options](#default-module-options)
  - [Decorator Options](#decorator-options)
- [Techniques](#techniques)
  - [Async Configuration](#async-configuration)
  - [Redis](#redis)
  - [Skipping](#skipping)
- [Custom Providers](#custom-providers)
  - [Key Extractors](#key-extractors)
  - [Error Factories](#error-factories)
  - [Options Factories](#options-factories)
- [License](#license)


## Features

* **NestJS Native**: Dependency injection and async configuration.
* **Different limiting strategies**:  *Fixed Window*, *Token Bucket*, *Sliding Window Counter*, *Sliding Window Log* and *Leaky Bucket*.
* **Different Storages**: In-memory (Map) and <a href="https://redis.io/?ref=soroushjp.com">Redis</a> (With <a href="https://www.lua.org/">Lua</a> scripts).
* **Custom Key Extractors**: Provide your custom key extraction logic. 
* **Custom Error Factories**: Customize you rate limit exhausted error.
* **Dynamic Configuration**: Provide dynamic rate limiting options. 

## Installation

```bash
npm i nestjs-rate-limiter
# or
yarn add nestjs-rate-limiter
# or
pnpm i nestjs-rate-limiter
# or
bun i nestjs-rate-limiter
```

## Quick Start

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { RateLimiterModule } from "nestjs-rate-limiter";
import { AppController } from "./app.controller.ts";

@Module({
    imports: [
        RateLimiterModule.forRoot({
            storage: "in-memory",
            scope: "my-scope",
            strategy: "token-bucket",
            strategyOptions: {
                // different strategies options (Optional)
            }
        })
    ],
    controllers: [AppController]
})
export class AppModule {}
```

```typescript
// app.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { RateLimit, RateLimitGuard } from "nestjs-rate-limiter";

@Controller()
@UseGuards(RateLimitGuard)
export class AppController {
    @Get("/hello")
    @RateLimit({ /* override default options */ }) 
    public hello() {
        return "Hello";
    }
}
```

## Configuration

### Module Configuration

There is only one required field in configuration - `storage`.

```typescript
RateLimiterModule.forRoot({
    storage: "in-memory",
    scope: "my-scope",

    // strategy configuration
    strategy: "token-bucket",
    strategyOptions: {
        fixedWindow: {
            // strategy-specific options
        },
        tokenBucket: {
            // strategy-specific options
        },
        slidingWindowCounter: {
            // strategy-specific options
        },
        slidingWindowLog: {
            // strategy-specific options
        },
        leakyBucket: {
            // strategy-specific options
        }
    },

    // default providers
    // ⚠️ NOTE: if you use custom providers here, they should be provided in `custom` field
    keyExtractor: undefined,
    errorFactory: undefined,
    optionsFactory: undefined,

    // custom providers
    custom: {
        keyExtractors: [/* You custom key extractors */],
        errorFactories: [/* You custom error factories */],
        optionsFactories: [/* You custom options factories */]
    }
});
```

### Default Module Options

Your custom options will be merged with this:

```typescript
{
    scope: "default-scope",

    strategy: "fixed-window",
    strategyOptions: {
        fixedWindow: {
            limit: 100,
            ttl: MS_IN_MINUTE
        },
        slidingWindowCounter: {
            limit: 100,
            windowMs: MS_IN_MINUTE
        },
        slidingWindowLog: {
            limit: 50,
            windowMs: MS_IN_MINUTE
        },
        tokenBucket: {
            capacity: 20,
            refillRate: 5 / MS_IN_MINUTE,
            ttl: 3 * MS_IN_MINUTE
        },
        leakyBucket: {
            capacity: 10,
            leakRate: 2 / MS_IN_MINUTE,
            ttl: 3 * MS_IN_MINUTE
        }
    },

    keyExtractor: BuiltinKeyExtractor,  // IP-address is used as key
    errorFactory: BuiltinErrorFactory,  // throws HttpException (from @nestjs/common)
    optionsFactory: undefined,          // no dynamic options by default

    custom: {
        keyExtractors: [],
        errorFactories: [],
        optionsFactories: []
    }
}
```

### Decorator Options

By default guard uses options provided in `RateLimiterModule` configuration. You can override this options in decorator:

```typescript
// Your custom providers
import { 
    MyCustomKeyExtractor, 
    MyCustomErrorFactory, 
    MyCustomOptionsFactory 
} from "./providers"

@RateLimit({
    scope: "my-custom-scope",

    keyExtractor: MyCustomKeyExtractor,
    errorFactory: MyCustomErrorFactory,
    factory: MyCustomOptionsFactory,

    // strategy-specific options
    strategy: "sliding-window-counter",
    limit: 100,
    windowMs: 1_000
})
```

## Techniques

### Async Configuration

> ⚠️ **Note**
>
> `custom` property should be provided in top of configuration object.

```typescript
RateLimiterModule.forRootAsync({
    imports: [],
    inject: [],
    useFactory: () => ({
        // This options are same to `forRoot` method excluding `custom` property
    }),

    // custom providers should be listed here
    custom: {
        keyExtractors: [],
        errorFactories: [],
        optionsFactories: []
    }
});
```

### Redis

For using Redis storage you need to create object or provider that implements `RedisStorage` type. 

1. Setting up your provider:

```typescript
import Redis, { type RedisValue } from "ioredis";
import type { RedisStorage } from "nestjs-rate-limiter";

@Injectable()
export class RedisService implements RedisStorage {
    private readonly client: Redis;

    public constructor(private readonly configService: ConfigService) {
        this.client = new Redis(/* ... */);
    }

    public async eval(script: string | Buffer<ArrayBufferLike>, numkeys: string | number, ...args: RedisValue[]) {
        return await this.client.eval(script, numkeys, ...args);
    }
}
```

> 📌 **Note**
>
> `Redis` type of `ioredis` package already implements `RedisStorage` type.
>
> You can use you provider this way:
> ```typescript
> import Redis, { type RedisValue } from "ioredis";
> import type { RedisStorage } from "nestjs-rate-limiter";
> 
> @Injectable()
> export class RedisService implements RedisStorage {
>     private readonly client: Redis;
> 
>     public constructor(private readonly configService: ConfigService) {
>         this.client = new Redis(/* ... */);
>     }
> 
>     public getClient() {
>         return this.client;  // Your client will be used as storage provider
>     }
> }
> ```

2. Register you module:

```typescript
@Module({
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule {}
```

3. Inject you Redis provider:

```typescript
RateLimiterModule.forRootAsync({
    imports: [RedisModule],
    inject: [RedisService],
    useFactory: (redisService: RedisService) => ({
        storage: "redis",
        instance: redisService  // or `redisService.getClient()`
    }),
    // ...
});
```

### Skipping

## Custom Providers

### Key Extractors

### Error Factories

### Options Factories

## License

MIT