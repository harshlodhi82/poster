import Transport from 'winston-transport'
import fetch from 'node-fetch'
import {getDateIsoString, getDate} from './utils'
import fs from 'fs-extra'
import path from 'path'
import ElasticsearchLib from 'lib/utils/Elasticsearch'

const getElasticsearchDate = () => getDate().replace(/-/g, '.')

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
    this.elasticsearchDate = getElasticsearchDate()
    this.elasticsearch = ElasticsearchLib({
      index: `log-${this.elasticsearchIndex}-${this.elasticsearchDate}`
    })
  }

  updateElasticSearchIndexDate () {
    if (this.elasticsearchDate === getElasticsearchDate()) {
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
    return `${this._file}-${getElasticsearchDate()}`
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

export default {Http, Elasticsearch, File}
