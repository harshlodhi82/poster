import fs from 'fs'
import csvParse from 'csv-parse/lib/sync'
import csvStringify from 'csv-stringify/lib/sync'
import download from 'download'
import log from 'lib/utils/logger'
import getCountdown from './countdown'
import crypto from 'crypto'
import util from 'util'
import nodePath from 'path'

const appendToPropNames = (obj, string) => {
  for (const prop in obj) {
    obj[string + prop] = obj[prop]
    delete obj[prop]
  }
  return obj
}

const csvFileToJson = (path) => {
  const rawData = fs.readFileSync(path, {encoding: 'utf8'})
  const data = csvToJson(rawData)
  return data
}

const csvToJson = (csv) => {
  csv = csv.replace(/^\ufeff/, '') // strip the BOM first character if present
  return csvParse(csv, {columns: true})
}

const jsonToCsv = (objectOfObjectsOrArrayOfObjects) => {
  const array = Object.values(objectOfObjectsOrArrayOfObjects)
  return csvStringify(array, {header: true})
}

const downloadToFile = async (url, path) => {
  const buffer = await download(url)
  fs.writeFileSync(path, buffer)
}

const sleep = (ms, msMax, options = {}) => {
  if (typeof ms !== 'number') {
    throw Error(`${ms} is not a sleep time number`)
  }
  if (typeof msMax === 'object') {
    options = msMax
  }
  if (typeof msMax === 'number') {
    if (ms >= msMax) {
      throw Error(`sleep time ${ms} is not smaller than ${msMax}`)
    }
    ms = getRandomNumberBetween(ms, msMax)
  }

  if (options.countdown) {
    getCountdown(ms)
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    if (options.unref) {
      timeout.unref()
    }
  })
}

const getRandomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const getRandomItemFromArray = (items) => items[Math.floor(Math.random() * items.length)]

const spliceRandomItemFromArray = (items) => items.splice(Math.floor(Math.random() * items.length), 1)[0]

const randomizeArray = (array) => {
  var currentIndex = array.length; var temporaryValue; var randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

const getRandomString = (length = 8) => crypto.randomBytes(length).toString('hex').substr(0, length)

const withRetry = (maxRetries, {timeout, throwOnFail} = {}) => {
  if (!maxRetries) {
    throw Error('withRetry must have a max retry count, e.g. const fetchWith3Retries = withRetry(3)(fetch)')
  }
  let retryCount = 0

  const curriedFunctionWithRetry = curriedFunction => async (...args) => {
    try {
      const res = await curriedFunction(...args)
      log.debug(`success ${args[0]} after ${retryCount} attempts...`)
      return res
    }
    catch (e) {
      log.notice(e.message)

      if (retryCount++ >= maxRetries) {
        retryCount = 0
        if (throwOnFail) {
          log.debug(`failure ${args[0]} after ${retryCount} attempts...`)
          log.info('throwing...')
          throw e
        }
        return null
      }
      log.debug(`retry ${args[0]} ${retryCount}...`)
      log.info(`retry ${retryCount}...`)
      if (timeout) {
        await sleep(timeout)
      }
      const res = await curriedFunctionWithRetry(curriedFunction)(...args)
      retryCount = 0
      return res
    }
  }

  return curriedFunctionWithRetry
  /* example usage const fetchWith3Retries = withRetry(3)(fetch) */
}

const withTimeout = (ms = 60000, {countdown} = {}) => {
  return (originalFunction) => {
    const originalFunctionName = originalFunction.name.split(' ').pop()

    const functionWithTimeout = async (...args) => {
      let finished = false
      let functionWithTimeoutRes
      let timeoutExceeded = false
      let error

      if (countdown) {
        countdown = getCountdown(ms, originalFunctionName)
      }

      const timeout = async () => {
        await sleep(ms, {unref: true})
        if (finished) {
          return
        }
        timeoutExceeded = true
        finished = true
      }

      const finish = async () => {
        try {
          const res = await originalFunction(...args)
          functionWithTimeoutRes = res
          timeoutExceeded = false
          finished = true
        }
        catch (e) {
          error = e
          finished = true
        }
      }

      await Promise.race([
        timeout(),
        finish()
      ])

      if (countdown) {
        countdown.end()
      }

      if (error) {
        throw error
      }

      if (timeoutExceeded) {
        throw Error(`${originalFunctionName} timeout exceeded ${ms}ms`)
      }

      return functionWithTimeoutRes
    }
    return functionWithTimeout
  }
}

const waitForOne = async (...conditions) => {
  let options = {}
  if (conditions.length > 1 && typeof conditions[conditions.length - 1] === 'object') {
    options = conditions.pop()
  }
  if (conditions[0] instanceof Array) {
    conditions = conditions[0]
  }
  const timeout = options.timeout || 60000
  const pollTime = options.pollTime || 100
  const error = options.error || `waitForOne timeout ${timeout}ms exceeded`
  const countdown = getCountdown(timeout)

  let timedout = false
  setTimeout(() => {
    timedout = true
  }, timeout).unref()
  // eslint-disable-next-line
  while (!timedout) {
    for (const condition of conditions) {
      try {
        if (await condition()) {
          log.info(`waitForOne found ${condition.toString()}`)
          countdown.end()
          return
        }
      }
      catch (e) {
        // necessary to wait for puppeteer pages
        if (
          !e.message.includes('Execution context was destroyed')
          && !e.message.includes('Cannot find context with specified id')
        ) {
          countdown.end()
          throw e
        }
      }
    }
    await sleep(pollTime)
  }
  countdown.end()
  if (error instanceof Error) {
    throw error
  }
  throw Error(error)
}

const waitFor = waitForOne

const splitArrayIntoChunks = (arr, chunkCount) => {
  var chunkLength = Math.max(arr.length / chunkCount, 1)
  var chunks = []
  for (var i = 0; i < chunkCount; i++) {
    if (chunkLength * (i + 1) <= arr.length)chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)))
  }
  return chunks
}

console.logFull = (string) => {
  return console.log(util.inspect(string, {showHidden: false, depth: null}))
}

const getDate = (timestamp = Date.now()) => new Date(timestamp).toISOString().split('T')[0]

const requireModulesFromDirectory = (directoryPath) => {
  const filteredFiles = []
  const files = fs.readdirSync(directoryPath)
  for (let file of files) {
    if (file.match(/^\./)) {
      continue
    }
    if (file.match(/\.test\.js$/)) {
      continue
    }
    if (file.match(/^index\.js$/)) {
      continue
    }
    file = file.replace(/\.js$/, '')
    filteredFiles.push(file)
  }
  const modules = {}
  for (const file of filteredFiles) {
    const filePath = nodePath.join(directoryPath, file)
    modules[file] = require(filePath)
  }
  return modules
}

const isNumber = (number) =>
  typeof number === 'number' || (typeof number === 'string' && !isNaN(Number(number)))

export {
  sleep,
  getRandomNumberBetween,
  withRetry,
  withTimeout,
  splitArrayIntoChunks,
  downloadToFile,
  csvToJson,
  csvFileToJson,
  jsonToCsv,
  getRandomItemFromArray,
  spliceRandomItemFromArray,
  getRandomString,
  randomizeArray,
  appendToPropNames,
  getDate,
  waitForOne,
  waitFor,
  getCountdown,
  requireModulesFromDirectory,
  isNumber
}
