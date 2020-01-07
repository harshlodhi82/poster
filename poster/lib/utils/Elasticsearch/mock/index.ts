import log from 'lib/utils/logger'
import orderBy from 'lodash.orderby'
import moment from 'moment'

const indices = {}

class Elasticsearch {
  index = null
  constructor ({index}) {
    if (!index || index.match(/[A-Z]/)) {
      throw Error(`invalid elasticsearch index '${index}'`)
    }
    this.index = index
    indices[this.index] = []
  }

  async search ({from, size, sort, query}: any) {
    log.debug({from, size, sort, query})
    await sleep(1)
    let foundDocuments = JSON.parse(JSON.stringify(indices[this.index]))
    if (query) {
      foundDocuments = queryDocuments(foundDocuments, query)
    }
    if (from) {
      foundDocuments = foundDocuments.slice(from)
    }
    if (size) {
      foundDocuments = sizeDocuments(foundDocuments, size)
    }
    if (sort) {
      foundDocuments = orderBy(foundDocuments, ...convertElasticsearchSortToLoDashOrderBy(sort))
    }
    return foundDocuments
  }

  async add (document) {
    await sleep(1)
    document = JSON.parse(JSON.stringify(document))
    for (const i in document) {
      if (document[i] === undefined) {
        delete document[i]
      }
    }
    indices[this.index].push(document)
  }

  dump () {
    return indices[this.index]
  }

  reset () {
    indices[this.index].length = 0
  }
}

const sizeDocuments = (documents, size) => {
  if (size === undefined || size === null) {
    // default elastic size is 10
    size = 10
  }
  if (size > 10000) {
    throw Error('max elasticsearch size is 10000')
  }
  if (documents.length > size) {
    documents.length = size
  }
  return documents
}

const queryDocuments = (documents, query) => {
  if (Object.keys(query).length === 0) {
    throw Error('empty Elasticsearch.search query')
  }
  for (const filter of query.bool.filter) {
    if (filter.term) {
      documents = filterTerm(documents, filter.term)
    }
    if (filter.terms) {
      documents = filterTerms(documents, filter.terms)
    }
    if (filter.range) {
      documents = filterRange(documents, filter.range)
    }
  }
  return documents
}

const filterRange = (documents, rangeFilter) => {
  // e.g. {timestamp: {gte: 'now-5h'}}
  const prop = getPropFromFilter(rangeFilter)
  const operator = getPropFromFilter(rangeFilter[prop])
  const value = rangeFilter[prop][operator]
  const calculatedValue = calculateValue(value)
  const foundDocuments = []
  if (operator === 'gte') {
    for (const document of documents) {
      if (document[prop] >= calculatedValue) {
        foundDocuments.push(document)
      }
    }
  }
  else {
    throw Error(`ElasticsearchMock query filter range operator '${operator}' not implemented`)
  }
  return foundDocuments
}

const calculateValue = (value) => {
  /* ISO time
  5y -> 5 years
  5M -> 5 month
  5w -> 5 weeks
  5d -> 5 days
  5h -> 5 hours
  5m -> 5 minutes
  5s -> 5 seconds
  https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html
  https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#date-math
  */
  if (isNumber(value)) {
    return Number(value)
  }

  if (value.match(/^now-/)) {
    // now's date minus ISO time
    const timeElapsed = value.split('-')[1]
    const number = timeElapsed.match(/^\d+/)[0]
    const string = timeElapsed.match(/[a-zA-Z]+$/)[0]
    return moment(Date.now()).subtract(number, string).toISOString()
  }
  throw Error(`ElasticsearchMock query filter range value '${value}' not implemented`)
}

const filterTerm = (documents, termFilter) => {
  const prop = getPropFromFilter(termFilter)
  const value = Object.values(termFilter)[0]
  const foundDocuments = []
  for (const document of documents) {
    if (document[prop] !== value) {
      continue
    }
    foundDocuments.push(document)
  }
  return foundDocuments
}

const filterTerms = (documents, termsFilter) => {
  const prop = getPropFromFilter(termsFilter)
  const possibleValues = Object.values(termsFilter)[0]
  const foundDocuments = []
  for (const document of documents) {
    let documentMatches = false
    // @ts-ignore
    for (const value of possibleValues) {
      if (document[prop] === value) {
        documentMatches = true
      }
    }
    if (documentMatches) {
      foundDocuments.push(document)
    }
  }
  return foundDocuments
}

const getPropFromFilter = (filter) => {
  // e.g. {'username.keyword': value}
  return Object.keys(filter)[0].split('.')[0]
}

const convertElasticsearchSortToLoDashOrderBy = (sortArray) => {
  // convert '[timestamp:desc, prop1:asc]' to [['timestamp', 'prop1'], ['desc', 'asc']]
  const props = sortArray.map(item => item.split(':')[0])
  const directions = sortArray.map(item => item.split(':')[1])
  return [props, directions]
}

const isNumber = (number) =>
  typeof number === 'number' || (typeof number === 'string' && !isNaN(Number(number)))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default ({index}) => new Elasticsearch({index})
