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
  - [Redis Injection](#redis-injection)
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

### Default Module Options

### Decorator Options

## Techniques

### Redis Injection

### Skipping

## Custom Providers

### Key Extractors

### Error Factories

### Options Factories

## License

MIT