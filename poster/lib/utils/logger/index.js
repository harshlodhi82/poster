/* example:
import log from 'lib/utils/logger'
log.addFile({file: 'file.txt'})
log.addElasticsearch({index: 'logger-test' , customProp2: 'test'})
log.info('this is my message')
*/

import autoBind from 'auto-bind'
import path from 'path'
import paths from 'lib/utils/paths'
import winston from 'winston'
import {
  getNextLogLine,
  getMsSinceLastLog,
  getFunctionName,
  getNamespace,
  getLogProperties,
  getTimestamp
} from './utils'
import formats from './formats'
import transports from './transports'

class Logger {
  constructor () {
    this.loggers = {
      console: winston.createLogger({
        levels,
        format: formats.console,
        transports: [new winston.transports.Console()],
        level: 'debug' // max level for this transport
      })
    }
    this.loggersCustomProperties = {}
    autoBind(this)

    this.logExceptions()
  }

  logExceptions () {
    process.on('unhandledRejection', (reason) => {
      this.error('unhandledRejection', reason)
    })
    process.on('uncaughtException', async (reason) => {
      this.error('uncaughtException', reason)
      if (!this.loggerHasFinished()) {
        await this.waitForLoggerToFinish()
      }
      process.exit()
    })
  }

  loggerHasFinished () {
    let finished = true
    for (const i in this.loggers) {
      if (this.loggers[i]._readableState.resumeScheduled !== false) {
        finished = false
      }
    }
    return finished
  }

  async waitForLoggerToFinish () {
    console.log('waiting for logger to finish')
    const promises = []
    const logPlaceholder = this._log
    this._log = () => {}
    for (const i in this.loggers) {
      const promise = new Promise(resolve => {
        this.loggers[i].on('finish', resolve)
      })
      promises.push(promise)
    }
    await Promise.all(promises)
    console.log('logger finished')
    this._log = logPlaceholder
  }

  error (...args) {
    this._log(args, {level: 'error'})
  }

  warn (...args) {
    this._log(args, {level: 'warn'})
  }

  notice (...args) {
    this._log(args, {level: 'notice'})
  }

  info (...args) {
    this._log(args, {level: 'info'})
  }

  debug (...args) {
    this._log(args, {level: 'debug'})
  }

  _log (args, {level}) {
    const timestamp = getTimestamp()
    const log = {
      level,
      levelPriority: getPriorityFromLevel(level),
      message: args,
      logLine: getNextLogLine(),
      timestamp,
      msSinceLastLog: getMsSinceLastLog(timestamp),
      functionName: getFunctionName(),
      namespace: getNamespace()
    }
    for (const i in this.loggers) {
      const logWithCustomProperties = getLogProperties(this.loggersCustomProperties[i], log)
      this.loggers[i].log(logWithCustomProperties)
    }
  }

  addFile ({file, ...loggerCustomProperties} = {}) {
    const i = `file-${file}`
    if (this.loggers[i]) {
      throw Error(`logger ${file} already exists`)
    }
    this.loggers[i] = winston.createLogger({
      levels,
      format: formats.file,
      transports: [new transports.File({file: this.getAbsoluteFilePath(file)})],
      level: 'debug' // max level for this transport
    })

    this.loggersCustomProperties[i] = loggerCustomProperties
  }

  removeFile (file) {
    if (typeof file === 'object') {
      file = file.file
    }
    if (!this.loggers[file]) {
      throw Error(`logger ${file} doesn't exist`)
    }
    delete this.loggers[file]
  }

  addElasticsearch ({index, ...loggerCustomProperties} = {}) {
    const i = `elasticsearch-${index}`
    if (this.loggers[i]) {
      throw Error(`logger ${index} already exists`)
    }

    this.loggers[i] = winston.createLogger({
      levels,
      format: formats.json,
      transports: [new transports.Elasticsearch({index})],
      level: 'debug' // max level for this transport
    })

    this.loggersCustomProperties[i] = loggerCustomProperties
  }

  removeElasticsearch (index) {
    if (typeof index === 'object') {
      index = index.index
    }
    if (!this.loggers[index]) {
      throw Error(`logger ${index} doesn't exist`)
    }
    delete this.loggers[index]
  }

  setProperty (property, value) {
    if (typeof property === 'object') {
      value = Object.values(property)[0]
      property = Object.keys(property)[0]
    }
    if (typeof property !== 'string') {
      throw Error(`invalid property ${property}`)
    }
    if (!value) {
      for (const i in this.loggersCustomProperties) {
        delete this.loggersCustomProperties[i][property]
      }
    }
    else {
      for (const i in this.loggersCustomProperties) {
        this.loggersCustomProperties[i][property] = value
      }
    }
  }

  removeProperty (property) {
    if (!this.loggersCustomProperties[property]) {
      throw Error(`logger property ${property} doesn't exist`)
    }
    delete this.loggersCustomProperties[property]
  }

  getAbsoluteFilePath (file) {
    if (!file) {
      throw Error('logger.getAbsoluteFilePath missing file argument')
    }
    return path.join(paths.PATH_LOG, file)
  }
}

/* Each level is given a specific integer priority. The higher the priority
the more important the message is considered to be, and the lower the
corresponding integer priority. For example, as specified exactly in RFC5424
the syslog levels are prioritized from 0 to 7 (highest to lowest). */
const levels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}
const getPriorityFromLevel = (level) => {
  const priority = levels[level]
  if (priority === undefined) {
    throw Error(`no level priority for '${level}'`)
  }
  return priority
}

export default new Logger()
