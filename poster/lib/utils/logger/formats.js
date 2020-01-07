import os from 'os'
import {inspect} from 'util'
import winston from 'winston'
import {
  colorize,
  getColor,
  jsonStringifyReplacers,
  getDateIsoString
} from './utils'

const fileFormat = winston.format.printf(info => {
  let message = JSON.parse(JSON.stringify(info.message, jsonStringifyReplacers))
  message = censorMessageCredentials(message)
  message = formatMessage(message)

  let namespace = info.namespace
  if (info.functionName) {
    namespace = `${namespace}:${info.functionName}`
  }

  const timestamp = getDateIsoString(info.timestamp)

  return `${timestamp} ${namespace} ${message}`
})

const consoleFormat = winston.format.printf(info => {
  const message = JSON.parse(JSON.stringify(info.message, jsonStringifyReplacers))

  const color = getColor(info.namespace)
  let namespace = info.namespace
  if (info.functionName) {
    namespace = `${namespace}:${info.functionName}`
  }
  namespace = colorize(namespace, {color, bold: true})
  const msSinceLastLog = colorize(`+${info.msSinceLastLog}ms`, {color})

  let log = `${formatMessage(message, {colors: true})} ${msSinceLastLog}`
  log = addNamespaceToMessage(log, namespace)
  return log
})

const jsonFormat = winston.format.printf(info => {
  let message = JSON.parse(JSON.stringify(info.message, jsonStringifyReplacers))
  message = censorMessageCredentials(message)
  message = formatMessage(message)
  return JSON.stringify({...info, message})
})

const addNamespaceToMessage = (log, namespace) => {
  const lines = log.split(/\r?\n/)
  for (const i in lines) {
    if (i === '0') {
      lines[i] = `  ${namespace}${lines[i]}`
    }
    else {
      lines[i] = `  ${lines[i]}`
    }
  }
  return lines.join(os.EOL)
}

const formatMessage = (args, {colors} = {}) => {
  let string = ''
  while (args.length) {
    string += formatMessageArg(args.shift(), {colors})
  }
  string = string.trim()
  return string
}

const formatMessageArg = (arg, {colors} = {}) => {
  if (typeof arg === 'object') {
    arg = inspect(arg, {colors, depth: null})
  }
  arg += ' '
  return arg
}

const censorMessageCredentials = (args) => {
  for (const i in args) {
    args[i] = censorObjectCredentials(args[i])
  }
  return args
}

const censorObjectCredentials = (object) => {
  for (const prop in object) {
    if (typeof object[prop] === 'object') {
      object[prop] = censorObjectCredentials(object[prop])
    }
    else if ((typeof object[prop]).match(/(string|number)/) && prop.match(/(password|token|key)/i)) {
      object[prop] = '*****'
    }
    else if (isUrlWithAuth(object[prop])) {
      object[prop] = censorUrlWithAuth(object[prop])
    }
  }
  return object
}

const isUrlWithAuth = (string) => typeof string === 'string' && !!string.match(/:\/\/[^:\n\t ,'"]+:[^:\n\t ,"']+?@/)

const censorUrlWithAuth = (url) => url.replace(/:[^:]+?@/, ':*****@')

const formats = {
  file: fileFormat,
  console: consoleFormat,
  json: jsonFormat
}

export default formats
