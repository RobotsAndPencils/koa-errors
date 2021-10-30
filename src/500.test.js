module.exports = (test, dependencies) => {
  'use strict'

  const { e500, Context } = dependencies

  return test('given koa-errors/500', {
    'when the middleware is executed': {
      when: async () => {
        const ctx = new Context()
        try {
          await e500()(ctx, () => {
            throw new Error('BOOM!')
          })
          throw new Error('Shouldn\'t get here')
        } catch (e) {
          return ctx
        }
      },
      'it should respond with a status of 500': (expect) => (err, actual) => {
        expect(err, 'to equal', null)
        expect(actual.response.status, 'to equal', 500)
      },
      'it should respond with a JSON body': (expect) => (err, actual) => {
        expect(err, 'to equal', null)
        expect(actual.response.body, 'to satisfy', { title: 'error' })
      },
      'it should emit uncaught_koa_error, and error events': (expect) => (err, actual) => {
        expect(err, 'to equal', null)
        expect(actual.state.logs[0][0].event, 'to equal', 'uncaught_koa_error')
        expect(actual.state.logs[0][0].category, 'to equal', 'error')
      },
    },
    'and the error has a status on it': {
      when: async () => {
        const ctx = new Context()
        try {
          await e500()(ctx, () => {
            const err = new Error('BOOM!')
            err.status = 502
            throw err
          })
          throw new Error('Shouldn\'t get here')
        } catch (e) {
          return ctx
        }
      },
      'it should use that status instead': (expect) => (err, actual) => {
        expect(err, 'to equal', null)
        expect(actual.response.status, 'to equal', 502)
      },
    },
    'and the error has a clientSafeMessage on it': {
      when: async () => {
        const ctx = new Context()
        try {
          await e500()(ctx, () => {
            const err = new Error('BOOM!')
            err.clientSafeMessage = 'this is safe'
            throw err
          })
          throw new Error('Shouldn\'t get here')
        } catch (e) {
          return ctx
        }
      },
      'it should include that message in the response body': (expect) => (err, actual) => {
        expect(err, 'to equal', null)
        expect(actual.response.body.message, 'to equal', 'this is safe')
      },
    },
    'and the showStack options is set to true': {
      when: async () => {
        const ctx = new Context()
        try {
          await e500({ showStack: true })(ctx, () => {
            throw new Error('BOOM!')
          })
          throw new Error('Shouldn\'t get here')
        } catch (e) {
          return ctx
        }
      },
      'it should include the error in the response body': (expect) => (err, actual) => {
        expect(err, 'to equal', null)
        expect(actual.response.body.error.message, 'to equal', 'BOOM!')
        expect(actual.response.body.error.stack, 'to contain', 'Error: BOOM!')
      },
    },
  })
}
