/* example:
const log = require('lib/utils/logger')
log.addFile({file: 'file.txt'})
log.addElasticsearch({index: 'logger-test' , customProp2: 'test'})
log.info('this is my message')
*/

const autoBind = require('auto-bind')
const path = require('path')
const ROOT_PATH = path.join('..', '..', '..', __dirname)
const winston = require('winston')
const {
  getNextLogLine,
  getMsSinceLastLog,
  getFunctionName,
  getNamespace,
  getLogProperties,
  getTimestamp
} = require('./utils')
const formats = require('./formats')
const transports = require('./transports')

class Logger {
  constructor () {
    this.folder = 'log'
    this.loggers = {
      console: winston.createLogger({
        levels,
        format: formats.console,
        transports: [new winston.transports.Console()],
        level: 'debug', // max level for this transport
        exitOnError: false
      })
    }
    this.loggersCustomProperties = {}
    autoBind(this)
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
      level: 'debug', // max level for this transport
      exitOnError: false
    })

    this.loggersCustomProperties[i] = loggerCustomProperties
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
      level: 'debug', // max level for this transport
      exitOnError: false
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

  removeLogstash (url) {
    if (typeof url === 'object') {
      url = url.url
    }
    if (!this.loggers[url]) {
      throw Error(`logger ${url} doesn't exist`)
    }
    delete this.loggers[url]
  }

  getAbsoluteFilePath (file) {
    if (!file) {
      throw Error('logger.getAbsoluteFilePath missing file argument')
    }
    return path.join(ROOT_PATH, this.getRelativeFilePath(file))
  }

  getRelativeFilePath (file) {
    return path.join(this.folder, file)
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

module.exports = new Logger()
