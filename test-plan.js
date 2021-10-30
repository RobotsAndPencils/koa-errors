const { LogEmitter } = require('@polyn/logger')
const EventEmitter = require('events')
const supposed = require('supposed')
const expect = require('unexpected')
const pkg = require('./package.json')
const { e500 } = require('.')

function Context () {
  const ctx = {
    request: {},
    response: {},
    state: {
      logger: new LogEmitter(),
      logs: [],
    },
    app: new EventEmitter(),
  }

  ctx.app.on('error', (err, ctx) => {
    ctx.state.logger.emit('uncaught_koa_error', 'error', { err })
  })
  ctx.state.logger.on('*', (...args) => ctx.state.logs.push(args))

  return ctx
}

const suite = supposed.Suite({
  name: pkg.name,
  assertionLibrary: expect,
  inject: { e500, Context },
})

const runner = suite.runner({
  cwd: __dirname,
})

const plan = runner.plan()

module.exports = { suite, runner, plan }
