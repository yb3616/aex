[![Build Status](https://travis-ci.com/calidion/aex.svg?branch=master)](https://travis-ci.com/calidion/aex)
[![Coverage Status](https://coveralls.io/repos/github/calidion/aex/badge.svg?branch=master)](https://coveralls.io/github/calidion/aex?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# AEX

A simple, async, scopde web server.

# A simple full example

```ts
import { Aex } from "@aex/core";

const aex = new Aex();

const options = {
  method: "get",
  url: "/",
  handler: async (req, res, scope) => {
    // request processing time started
    console.log(scope.time.stated);
    // processing time passed
    console.log(scope.time.passed);
    res.send("Hello Aex!");
  }
};

aex.handle(options);

aex.prepare();

const port = 3000;
const host = "localhost";
aex.start(port, host).then();
```

# Install

```sh
npm i @aex/core
```

or

```sh
yarn add @aex/core
```

# Usage

## 1. Create an Aex instance

```ts
const aex = new Aex();
```

or

```ts
// with express app pre-created;
import * as express from "express";
const app = express();
const aex = new Aex(app);
// aex.app === app
```

> you can get express app any time by using `aex.app` attribute

## 2. Setup the option for handler

```ts
const options = {
  method: "get",
  url: "/",
  handler: async (req, res, scope) => {
    res.send("Hello world!");
  }
};

aex.handle(options);
```

## 3. Prepare the server

```ts
aex.prepare();
```

## 4. Start the server

```ts
const port = 3000;
const host = "localhost";
const server = await aex.start(port, host);
// server === aex.server
```

### The Option for handler

The option is a composition of a `method`, a `url`, a `handler` and `middlewares`.

where:

the `method` is the http method,

the `url` is an express supported url,

the `handler` is an async function `IAsyncHandler` which defined as follows:

```ts
export type IAsyncMiddleware = (
  req: Request,
  res: Response,
  scope?: object
) => Promise<boolean | undefined | null | void>;
export type IAsyncHandler = IAsyncMiddleware;
```

the `middlewares` is an array of async functions which are executed in order. The async function is of the same format to the handler but called `IAsyncMiddleware` for distinguish only.

> middlewares can return `false` to stop further execution

# Middlewares

## Global middlewares

Global middlewares are effective all over the http request process.

They can be added by `aex.use` function.

```ts
aex.use(async (req, res, scope) => {
  // process 1
  // return false
});

aex.use(async (req, res, scope) => {
  // process 2
  // return false
});

// ...

aex.use(async (req, res, scope) => {
  // process N
  // return false
});
```

> Return `false` in middlewares will cancel the whole http request processing  
> It normally happens after a `res.end`

## Handler specific middlewares

Handler specific middlewares are effective only to the specific handler.

They can be optionally added to the handler option via the optional attribute `middlewares`.

the `middlewares` attribute is an array of async functions of `IAsyncMiddleware`.

so we can simply define handler specific middlewares as follows:

```ts
const options = {
  method: "get",
  url: "/",
  handler: async (req, res, scope) => {
    res.send("Hello world!");
  },
  middlewares: [
    async (req, res, scope) => {
      // process 1
      // return false
    },
    async (req, res, scope) => {
      // process 2
      // return false
    },
    // ...,
    async (req, res, scope) => {
      // process N
      // return false
    }
  ]
};

aex.handle(options);
```

# Accessable members

## app

The instance of express Application.

Accessable through `aex.app`.

```ts
const app = express();
const aex = new Aex(app);
expect(aex.app === app).toBeTruthy();
```

## server

The node system `http.Server`.

Accessable through `aex.server`.

```ts
const aex = new Aex();
const server = await aex.start();
expect(server === aex.server).toBeTruthy();
server.close();
```

# Scope

Aex provided scope data for global and local usage.

A scope object is passed by middlewares or handlers right after `req`, `res` as the third parameter.

It is defined in `IAsyncMiddleware`, like the following:

```ts
async (req, res, scope) => {
  // process N
  // return false
};
```

scope has three native attributes: `time`, `outter`, `inner`.

The `time` attribute contains the start time of the request.
The `outter` attribute is to store general or global data.
The `local` attribute is to store specific or local data.

## `time`

1. Get the requesting time

```ts
scope.time.started;
// 2019-12-12T09:01:49.543Z
```

2.  Get the passed time

```ts
scope.time.passed;
// 2019-12-12T09:01:49.543Z
```

## `inner` and `outter`

`inner` and `outter` are objects used to store data for different purpose.

You can simply assign them a new attribute with data;

```ts
scope.inner.a = 100;
scope.outter.a = 120;
```

but the direct assignment to `outter` and `inner` is now allowed.

```ts
// scope.outter = {};  // Wrong operation!
// scope.outter = {};  // Wrong operation!
```

# Use leagacy middlewares from expressjs

Aex provide a way for express middlewares to be able used with Aex.

You need just a simple call to `toAsyncMiddleware` to generate an aync middleware.

```ts
const oldMiddleware = (_req: any, _res: any, next: any) => {
  // ...
  next();
};

const pOld = toAsyncMiddleware(oldMiddleware);
aex.use(pOld);
```

> You should be cautious to use middlewares.
> Fully testing is appreciated.
