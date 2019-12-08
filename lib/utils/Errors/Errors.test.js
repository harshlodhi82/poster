const test = require('tape')
const Errors = require('./index')

test('Errors', t => {
  const errors = Errors([
    {
      type: 'AccountError',
      message: 'ACCOUNT_NOT_FOUND'
    },
    {
      type: 'AccountError',
      message: 'ACCOUNT_DISABLED'
    },
    {
      type: 'ProxyError',
      message: 'BAD_PROXY'
    }
  ])

  let error
  try {
    throw errors.AccountError('ACCOUNT_NOT_FOUND')
  }
  catch (e) {
    error = e
  }
  t.equal(error.name, 'AccountError')
  t.equal(error.message, 'ACCOUNT_NOT_FOUND')
  t.ok(error instanceof Error)
  t.ok(error.toString().match('AccountError: ACCOUNT_NOT_FOUND'))

  try {
    throw errors.AccountError('SOMETHING_INVALID')
  }
  catch (e) {
    error = e
  }
  t.equal(error.name, 'Error')
  t.equal(error.message, `no custom error type 'AccountError' message 'SOMETHING_INVALID'`)

  t.equal(errors.messages.ACCOUNT_NOT_FOUND, 'ACCOUNT_NOT_FOUND')
  try {
    if (errors.messages.SOMETHING_INVALID) {}
    t.fail('invalid message should throw')
  }
  catch (e) {}

  t.equal(errors.types.AccountError, 'AccountError')
  try {
    if (errors.messages.InvalidError) {}
    t.fail('invalid error type should throw')
  }
  catch (e) {}

  t.equal(errors.errorMessageIsOfErrorType({type: 'AccountError', message: 'ACCOUNT_NOT_FOUND'}), true)
  t.equal(errors.errorMessageIsOfErrorType({type: 'AccountError', message: 'BAD_PROXY'}), false)

  t.end()
})
