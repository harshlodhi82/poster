import getArticleFromEzineArticles from './index'
import ProxyServer from 'lib/utils/ProxyServer'

const excludeArticleIds = new Set([
  '235138',
  '144878',
  '5666000',
  '6493629',
  '103118',
  '181159',
  '9966539',
  '690107'
])

test('getArticleFromEzineArticles 3 red flowers', async () => {
  const keyword = '3 red flowers'
  const article = await getArticleFromEzineArticles({keyword, excludeArticleIds})
  testArticle({article, excludeArticleIds})
})

describe('with bad proxy', () => {
  /* this test emulates a connection using a bad proxy
  the connection drops 50% of the time.
  use DEBUG=proxy env to see what the proxy does */
  let proxy
  const onProxyRequestMock = jest.fn()
  beforeAll(async () => {
    proxy = await ProxyServer({
      username: 'test',
      password: 'testPass',
      dropRate: 0.5,
      throttleRate: 0.5
    })
    proxy.on('proxyrequest', onProxyRequestMock)
  })
  afterAll(async () => {
    await proxy.close()
  })
  test('getArticleFromEzineArticles 3 red flowers', async () => {
    const keyword = '3 red flowers'
    const article = await getArticleFromEzineArticles({keyword,
      excludeArticleIds,
      proxy: {
        host: proxy.host,
        username: proxy.username,
        password: proxy.password
      }})
    testArticle({article, excludeArticleIds})
  })
  test('proxy was used', () => {
    expect(onProxyRequestMock).toHaveBeenCalled()
  })
})

test('getArticleFromEzineArticles how to tie a tie', async () => {
  const keyword = 'how to tie a tie'
  const article = await getArticleFromEzineArticles({keyword})
  testArticle({article})
})

test('getArticleFromEzineArticles fastest computer 2019', async () => {
  const keyword = 'fastest computer 2019'
  const article = await getArticleFromEzineArticles({keyword})
  testArticle({article})
})

const testArticle = ({article, excludeArticleIds = new Set()}) => {
  expect(typeof article.title).toBe('string')
  expect(article.title.length).toBeGreaterThan(20)
  expect(typeof article.content).toBe('string')
  expect(article.content.length).toBeGreaterThan(100)
  expect(typeof article.id).toBe('string')
  expect(excludeArticleIds.has(article.id)).toBeFalsy()
}

describe('invalid args', () => {
  test(`throws empty keyword`, async () => {
    await expect(getArticleFromEzineArticles({keyword: ''})).rejects.toThrow()
  })
})
