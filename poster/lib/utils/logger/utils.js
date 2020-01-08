import paths from 'lib/utils/paths'

const getColor = (namespace) => {
  require('supports-color')
  const colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]
  let hash = 0
  for (let i = 0; i < namespace.length; i++) {
    hash = ((hash << 5) - hash) + namespace.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return colors[Math.abs(hash) % colors.length]
}

const colorize = (string, {color, bold} = {}) => {
  if (typeof color !== 'number') {
    throw Error(`color code ${color} is not a number`)
  }
  const colorCode = '\u001B[3' + (color < 8 ? color : '8;5;' + color)
  if (bold) {
    return `${colorCode};1m${string} \u001B[0m`
  }
  return colorCode + 'm' + string + '\u001B[0m'
}

const getNamespace = () => {
  const stack = new Error().stack.split(/\r?\n/)
  const absolutePath = getPathFromStackLine(stack[4])
  const relativePath = absolutePath.replace(paths.PATH_ROOT, '')
  let namespace = relativePath
    .replace(/\.[^.]+$/, '')
    .replace(/\./g, '')
    .replace(/^\//, '')
    .replace(/\//g, ':')
    .toLowerCase()
  namespace = namespace.replace(/^lib:utils:/, '')
  namespace = namespace.replace(/^lib:/, '')
  namespace = namespace.replace(/^apps:/, '')
  namespace = namespace.replace('tasks:', '')
  namespace = namespace.replace(/:index$/, '')
  namespace = removeConsecutiveDuplicateNamespaces(namespace)

  // if namespace is just 'logger', it is probably an uncaught exception
  if (namespace === 'logger') {
    namespace = 'uncaughtexception'
  }
  return namespace
}

const removeConsecutiveDuplicateNamespaces = (namespace) => namespace.replace(/([^:]+)(?: \1\b)+/g, '$1')

const getPathFromStackLine = (stackLine) => stackLine.split(/[ (]+/).pop().split(':')[0]

const getFunctionName = () => {
  const stack = new Error().stack.split(/\r?\n/)
  const functionName = stack[4].split(/ +/)[2]
  if (functionName.match('(:|<anonymous>)')) {
    // stack trace line has no function name, only file path
    // could be a callback or top level log
    return
  }
  return functionName.split('.').pop()
}

let lastTimestamp
const getMsSinceLastLog = (currentTimestamp) => {
  if (!currentTimestamp) {
    throw Error(`invalid current timestamp '${currentTimestamp}'`)
  }
  let msSinceLastLog = 0
  if (lastTimestamp) {
    msSinceLastLog = currentTimestamp - lastTimestamp
  }
  lastTimestamp = currentTimestamp
  return msSinceLastLog
}

let currentLogLine = 0
const getNextLogLine = () => {
  return ++currentLogLine
}

const getLogProperties = (...logPropertiesObjects) => {
  const mergedLogProperties = {}
  for (const logProperties of logPropertiesObjects) {
    for (const propertyName in logProperties) {
      if (logProperties[propertyName] === undefined || logProperties[propertyName] === null) {
        continue
      }
      const availablePropertyName = getAvailablePropertyName(propertyName, mergedLogProperties)
      mergedLogProperties[availablePropertyName] = logProperties[propertyName]
    }
  }
  return mergedLogProperties
}

const getAvailablePropertyName = (propertyName, mergedLogProperties) => {
  let availablePropertyName = propertyName
  while (mergedLogProperties[availablePropertyName] !== undefined || propertyNameIsReserved(availablePropertyName)) {
    availablePropertyName = `_${availablePropertyName}`
  }
  if (propertyName !== availablePropertyName) {
    console.log(Error(`log property name '${propertyName}' conflict renamed to '${availablePropertyName}'`))
  }
  return availablePropertyName
}

const propertyNameIsReserved = (propertyName) => {
  const reservedPropertyNames = new Set([
    '_uid',
    '_id',
    '_type',
    '_source',
    '_all',
    '_parent',
    '_field_names',
    '_routing',
    '_index',
    '_size',
    '_timestamp',
    '_ttl'
  ])
  if (reservedPropertyNames.has(propertyName)) {
    return true
  }
  return false
}

const jsonStringifyReplacers = (key, value) => {
  value = jsonStringifyErrorReplacer(key, value)
  value = jsonStringifySetReplacer(key, value)
  value = jsonStringifyMapReplacer(key, value)
  return value
}

const jsonStringifyErrorReplacer = (key, value) => {
  if (value instanceof Error) {
    return value.stack
  }
  return value
}

const jsonStringifySetReplacer = (key, value) => {
  if (value instanceof Set) {
    return [...value]
  }
  return value
}

const jsonStringifyMapReplacer = (key, value) => {
  if (value instanceof Map) {
    return [...value.entries()]
  }
  return value
}

const getTimestamp = Date.now // save Date.now in case it gets mocked somewhere else
const _Date = Date
_Date.toISOString = Date.toISOString
const getDateIsoString = (timestamp) => new _Date(timestamp).toISOString()
const getDate = () => new _Date().toISOString().split('T')[0].replace(/-/g, '.')

export {
  getMsSinceLastLog,
  getFunctionName,
  getPathFromStackLine,
  getNamespace,
  colorize,
  getColor,
  getNextLogLine,
  getLogProperties,
  jsonStringifyReplacers,
  getTimestamp,
  getDateIsoString,
  getDate
}
