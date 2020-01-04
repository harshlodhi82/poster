import log from 'lib/utils/logger'
import {Client} from '@elastic/elasticsearch'

class Elasticsearch {
  client = null
  index = null
  url = null
  constructor ({index, url}) {
    if (!index || index.match(/[A-Z]/)) {
      throw Error(`invalid elasticsearch index '${index}'`)
    }
    this.url = url || require('secret/elk').elasticsearch
    if (!this.url) {
      throw Error(`invalid elasticsearch url '${this.url}'`)
    }
    log.info({url: this.url, index})
    this.client = new Client({node: this.url})
    this.index = index
  }

  async search ({from, size, sort, ...body}: any) {
    const res = await this.client.search({
      index: this.index,
      from,
      size,
      sort,
      pretty: true,
      body: {...body}
    })
    if (body.aggs) {
      return this._parseAggregations(res.body.aggregations)
    }
    const documents = res.body.hits.hits.map(document => document._source)
    return documents
  }

  add (document, options = {}) {
    let pipeline
    if (document.geoip) {
      // geoip pipeline must be enabled manually
      pipeline = 'geoip'
    }
    return this.client.index({index: this.index, body: document, pipeline, ...options})
  }

  bulk (documents, options) {
    if (!documents.length) {
      throw Error('elasticsearch.bulk documents array cannot be empty')
    }
    const body = documents.flatMap(doc => [{index: {_index: this.index}}, doc])
    return this.client.bulk({body, ...options})
  }

  dump () {
    return this.search({size: 10000})
  }

  async reset () {
    try {
      await this.client.indices.delete({index: this.index})
    }
    catch (e) {
      log.info(e.message)
    }
  }

  async canConnect () {
    try {
      const {body} = await this.client.cat.health()
      log.info(body)
      return true
    }
    catch (e) {
      log.error(e.message)
      return false
    }
  }

  _parseAggregations (aggregations) {
    const buckets = parseBuckets(aggregations)
    return buckets
  }
}

const parseBuckets = (aggregations) => {
  const nextAggregations = getNextAggregations(aggregations)
  if (aggregationsHaveHits(nextAggregations)) {
    return getDocumentsFromAggregationsHits(nextAggregations)
  }
  if (!aggregationsHaveBuckets(nextAggregations)) {
    aggregations = parseBuckets(nextAggregations)
    return aggregations
  }
  const parsedBuckets = {}
  if (aggregationsHaveFinalBuckets(nextAggregations)) {
    for (const bucket of nextAggregations.buckets) {
      parsedBuckets[bucket.key] = bucket.doc_count
    }
    return parsedBuckets
  }
  for (const bucket of nextAggregations.buckets) {
    parsedBuckets[bucket.key] = parseBuckets(bucket)
  }
  return parsedBuckets
}

const getDocumentsFromAggregationsHits = (aggregations) => {
  return aggregations.hits.hits.map(document => document._source)
}

const aggregationsHaveHits = (aggregations) => {
  return aggregations && aggregations.hits
}

const aggregationsHaveBuckets = (aggregations) => {
  return aggregations && Array.isArray(aggregations.buckets)
}

const getNextAggregations = (aggregations) => {
  for (const i in aggregations) {
    if (typeof aggregations[i] === 'object') {
      return aggregations[i]
    }
  }
}

const aggregationsHaveFinalBuckets = (aggregations) => {
  const firstBucket = aggregations.buckets[0]

  for (const i in firstBucket) {
    if (typeof firstBucket[i] === 'object' && !Array.isArray(firstBucket[i])) {
      return false
    }
  }
  return true
}

export default ({index, url = null}) => new Elasticsearch({index, url}) as any
