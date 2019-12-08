/* example:
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
    },
    {
      type: 'ProxyError',
      message: 'SLOW_PROXY'
    },
    {
      type: 'ServiceError',
      message: 'INSUFFICIENT_BALANCE'
    }
  ])
  throw errors.AccountError('ACCOUNT_NOT_FOUND')
  errors.errorMessageIsOfErrorType({message: 'ACCOUNT_NOT_FOUND', type: 'AccountError'})
  errors.messages.INSUFFICIENT_BALANCE === 'INSUFFICIENT_BALANCE' // true
*/

const autoBind = require('auto-bind')

class Errors {
  constructor (errors) {
    if (!Array.isArray(errors)) {
      throw TypeError('Errors constructor argument is not an array')
    }
    this.errors = parseErrorTypesAndMessages(errors)
    this._messages = parseErrorMessages(errors)
    this._types = parseErrorTypes(errors)
    autoBind(this)
    this.assignErrorTypes()
  }

  assignErrorTypes () {
    for (const errorType in this.errors) {
      this[errorType] = this.createCustomErrorType({type: errorType})
    }
  }

  createCustomErrorType ({type}) {
    const errors = this.errors
    function CustomError (message, fileName, lineNumber) {
      // throw if the message is not part of this.errors
      if (!errors[type] || !errors[type][message]) {
        throw Error(`no custom error type '${type}' message '${message}'`)
      }

      // weird trick to create dynamic class name from error type
      const classes = {[type]: class extends Error {
        constructor (...params) {
          // Pass remaining arguments (including vendor specific ones) to parent constructor
          super(...params)
          // define name without enumeratable
          Object.defineProperty(this, 'name', {
            value: type
          })
          // Maintains proper stack trace for where our error was thrown (only available on V8)
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, classes[type])
          }
        }
      }}

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      const instance = new classes[type](message, fileName, lineNumber)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(instance, CustomError)
      }
      return instance
    }

    return CustomError
  }

  errorMessageIsOfErrorType ({type, message}) {
    if (!this.errors[type]) {
      throw Error(`no custom error type '${type}'`)
    }
    return !!this.errors[type][message]
  }

  get messages () {
    return new Proxy(this._messages, {
      get: (messages, message) => {
        if (!messages[message]) {
          throw Error(`no custom error message '${message}'`)
        }
        return messages[message]
      }
    })
  }

  get types () {
    return new Proxy(this._types, {
      get: (types, type) => {
        if (!types[type]) {
          throw Error(`no custom error type '${type}'`)
        }
        return types[type]
      }
    })
  }
}

const parseErrorTypesAndMessages = (errors) => {
  const parsedErrors = {}
  for (const error of errors) {
    if (!parsedErrors[error.type]) {
      parsedErrors[error.type] = {}
    }
    parsedErrors[error.type][error.message] = error
  }
  return parsedErrors
}

const parseErrorMessages = (errors) => {
  const parsedMessages = {}
  for (const error of errors) {
    parsedMessages[error.message] = error.message
  }
  return parsedMessages
}

const parseErrorTypes = (errors) => {
  const parsedTypes = {}
  for (const error of errors) {
    parsedTypes[error.type] = error.type
  }
  return parsedTypes
}

module.exports = (...args) => new Errors(...args)
