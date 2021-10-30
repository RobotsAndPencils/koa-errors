function Factory (deps) {
  'use strict'

  const { optional } = deps.blueprint
  const { immutable } = deps.immutable

  const Options = immutable('e500Options', {
    showStack: optional('boolean').withDefault(false),
  })

  const e500 = (input) => {
    const { showStack } = new Options({ ...input })

    return async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.app.emit('error', err, ctx) // emit first to make sure the error gets logged
        const status = typeof err.status === 'number' ? err.status : 500
        const errorBody = { title: 'error' }

        if (err.clientSafeMessage) {
          errorBody.message = err.clientSafeMessage
        }

        if (showStack) {
          errorBody.error = {
            message: err.message,
            stack: err.stack,
          }
        }

        ctx.response.status = status
        ctx.response.body = errorBody
      }
    }
  }

  return { e500 }
}

module.exports = Factory
