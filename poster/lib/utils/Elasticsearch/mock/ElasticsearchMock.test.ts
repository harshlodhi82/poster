import Elasticsearch from './index'
const elasticsearch = Elasticsearch({index: 'index-test'})

const NOW = 1500000000000
const MINUTE = 1000 * 60
let nextTimestamp = NOW
const getNextDate = () => {
  const date = new Date(nextTimestamp).toISOString()
  nextTimestamp += 5 * MINUTE
  return date
}

let nextDocumentId = 1
const getNextDocumentId = () => nextDocumentId++

const documents = [
  {
    timestamp: getNextDate(),
    documentId: getNextDocumentId(),
    prop1: 'prop1 value',
    prop2: 'prop2 value',
    prop3: 'prop3 value'
  },
  {
    timestamp: getNextDate(),
    documentId: getNextDocumentId(),
    prop1: 'prop1 value',
    prop2: 'prop2 value',
    prop3: 'prop3 value'
  },
  {
    timestamp: getNextDate(),
    documentId: getNextDocumentId(),
    prop1: 'prop1 value',
    prop2: 'prop2 value',
    prop3: 'prop3 value'
  },
  {
    timestamp: getNextDate(),
    documentId: getNextDocumentId(),
    prop1: 'prop1 value',
    prop2: 'prop2 value',
    prop3: 'prop3 value'
  },
  {
    timestamp: getNextDate(),
    documentId: getNextDocumentId(),
    prop1: 'prop1 value',
    prop2: 'prop2 value',
    prop3: 'prop3 value'
  }
]

test('elasticsearchMock.add', async () => {
  for (const document of documents) {
    await elasticsearch.add(document)
  }
})

test('elasticsearchMock.search size', async () => {
  let foundDocuments
  foundDocuments = await elasticsearch.search({size: 1})
  expect(foundDocuments.length).toBe(1)
})

test('elasticsearchMock.search from', async () => {
  let foundDocuments
  foundDocuments = await elasticsearch.search({from: documents.length - 1})
  expect(foundDocuments.length).toBe(1)
})

test('elasticsearchMock.search sort', async done => {
  let foundDocuments
  foundDocuments = await elasticsearch.search({sort: ['timestamp:desc', 'document:desc']})
  for (const [i, document] of foundDocuments.entries()) {
    if (i === 0) {
      continue
    }
    if (document.timestamp > foundDocuments[i - 1].timestamp) {
      done.fail(`${document.timestamp} <= ${foundDocuments[i - 1].timestamp}`)
    }
  }
  foundDocuments = await elasticsearch.search({sort: ['timestamp:asc', 'document:asc']})
  for (const [i, document] of foundDocuments.entries()) {
    if (i === 0) {
      continue
    }
    if (document.timestamp < foundDocuments[i - 1].timestamp) {
      done.fail(`${document.timestamp} >= ${foundDocuments[i - 1].timestamp}`)
    }
  }
  done()
})

test('elasticsearchMock.search query term filter', async () => {
  let foundDocuments
  let query
  query = {bool: {filter: [
    {term: {documentId: documents[0].documentId}},
    {term: {prop1: documents[0].prop1}}
  ]}}
  foundDocuments = await elasticsearch.search({query})
  expect(foundDocuments[0]).toEqual(documents[0])
  expect(foundDocuments.length).toBe(1)
})

test('elasticsearchMock.search query terms filter', async () => {
  let foundDocuments
  let query
  query = {bool: {filter: [
    {terms: {documentId: [documents[0].documentId, documents[1].documentId]}}
  ]}}
  foundDocuments = await elasticsearch.search({query})
  expect(foundDocuments).toEqual([documents[0], documents[1]])
  expect(foundDocuments.length).toBe(2)
})

test('elasticsearchMock.search query range filter', async done => {
  const nowPlus11Minutes = NOW + (17 * MINUTE)
  const DateNow = Date.now
  Date.now = () => nowPlus11Minutes

  let foundDocuments
  let query
  query = {bool: {filter: [
    {range: {timestamp: {gte: 'now-11m'}}}
  ]}}
  foundDocuments = await elasticsearch.search({query})
  const timestampNowPlus6Minutes = new Date(NOW + (6 * MINUTE)).toISOString()
  for (const document of foundDocuments) {
    if (document.timestamp < timestampNowPlus6Minutes) {
      done.fail(`${document.timestamp} >= ${timestampNowPlus6Minutes}`)
    }
  }

  Date.now = DateNow
  done()
})
