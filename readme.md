<p align="center">
    <a href="http://nestjs.com/" target="blank">
        <img src="https://docs.nestjs.com/assets/logo-small-gradient.svg" width="320" alt="Nest Logo" />
    </a>
</p>

<p align="center">
    A rate limiter module for <a href="http://nestjs.com/">NestJS</a> framework (Node.js).
</p>


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

## License

MIT