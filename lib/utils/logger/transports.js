const Transport = require('winston-transport')
const fetch = require('node-fetch')
const {getDateIsoString, getDate} = require('./utils')
const fs = require('fs-extra')
const path = require('path')

class Http extends Transport {
  constructor (options) {
    super(options)
    this.url = options.url
    this.method = options.method || 'PUT'
  }

  log (info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    const formattedLog = info[Symbol.for('message')]
    fetch(this.url, {
      method: this.method,
      body: formattedLog
    })
      .then(response => response.text())
      .then(text => {
        callback()
      })
      .catch(e => {
        console.log(`logger http transport error: ${e.message}`)
      })
  }
}

class Elasticsearch extends Transport {
  constructor (options) {
    super(options)
    this.elasticsearchIndex = options.index
    this.setElasticsearchIndex()
  }

  setElasticsearchIndex () {
    this.elasticsearchDate = getDate()
    this.elasticsearch = require('lib/utils/Elasticsearch')({
      index: `log-${this.elasticsearchIndex}-${this.elasticsearchDate}`
    })
  }

  updateElasticSearchIndexDate () {
    if (this.elasticsearchDate === getDate()) {
      return
    }
    this.setElasticsearchIndex()
  }

  async log (info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    let formattedLog = info[Symbol.for('message')]
    formattedLog = JSON.parse(formattedLog)
    formattedLog.timestamp = getDateIsoString(formattedLog.timestamp)
    this.updateElasticSearchIndexDate()
    try {
      await this.elasticsearch.add(formattedLog)
    }
    catch (e) {
      console.log(`logger elasticsearch transport error: ${e.message}`)
      console.log(formattedLog)
    }
    callback()
  }
}

class File extends Transport {
  constructor (options) {
    super(options)
    this._file = options.file
    fs.ensureDirSync(path.dirname(this._file))
  }

  get file () {
    return `${this._file}-${getDate()}`
  }

  async log (info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })
    let formattedLog = info[Symbol.for('message')]
    try {
      await fs.appendFile(this.file, `${formattedLog}\n`)
    }
    catch (e) {
      console.log(`logger file transport error: ${e.message}`)
      console.log(formattedLog)
    }
    callback()
  }
}

module.exports = {Http, Elasticsearch, File}
