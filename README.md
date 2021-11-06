# koa-errors

[![tests](https://github.com/RobotsAndPencils/koa-errors/actions/workflows/pr-check.yml/badge.svg)](https://github.com/RobotsAndPencils/koa-errors/actions/workflows/pr-check.yml)
[![Coverage Status](https://coveralls.io/repos/github/RobotsAndPencils/koa-errors/badge.svg?branch=main)](https://coveralls.io/github/RobotsAndPencils/koa-errors?branch=main)

`@robotsandpencils/koa-errors` is a simple koa middleware for handling error states (i.e. 500 errors). It's primary usage is to produce human, and program readable 500 errors that only include stack traces in development environments.

## Usage

```Shell
$ npm install --save @robotsandpencils/koa-errors
```

```JavaScript
const { e500 } = require('@robotsandpencils/koa-errors')
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

app.on('error', (err, ctx) => {
  console.log('uncaught_koa_error', err, ctx)
})

app.use(e500({
  showStack: process.env.NODE_ENV === 'local',
}))

router.get('/boom', async (ctx) => {
  throw new Error('BOOM!')
})

app.use(router.routes())
app.listen(3000)
```

## Arguments

`@robotsandpencils/koa-errors` accepts the following arguments:

-   **showStack**: whether or not to show the stack trace in the response body. Always set this to false in publically accessible environments, such as production.
