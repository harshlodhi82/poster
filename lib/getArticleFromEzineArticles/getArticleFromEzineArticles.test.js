import getArticleFromEzineArticles from './index'

let proxy
try {
  const {proxy: proxyHost, proxyUsername, proxyPassword} = require('secret/proxy')
  proxy = {proxy: proxyHost, proxyUsername, proxyPassword}
}
catch (e) {}

test('getArticleFromEzineArticles 3 red flowers', async () => {
  const keyword = '3 red flowers'
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
  const article = await getArticleFromEzineArticles({keyword, excludeArticleIds})
  testArticle({article, excludeArticleIds})
})

test('getArticleFromEzineArticles 3 red flowers with proxy', async () => {
  const keyword = '3 red flowers'
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
  const article = await getArticleFromEzineArticles({keyword, excludeArticleIds, proxy})
  testArticle({article, excludeArticleIds})
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

const testArticle = ({article, excludeArticleIds = new Set()} = {}) => {
  const {articleTitle, articleContent, articleId} = article
  expect(typeof articleTitle === 'string').toBeTruthy()
  expect(articleTitle && articleTitle.length > 20).toBeTruthy()
  expect(typeof articleContent === 'string').toBeTruthy()
  expect(articleContent && articleContent.length > 100).toBeTruthy()
  expect(articleId && typeof articleId === 'string').toBeTruthy()
  expect(excludeArticleIds.has(articleId)).toBeFalsy()
}

test('getArticleFromEzineArticles invalid args', async done => {
  try {
    await getArticleFromEzineArticles({})
    done.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getArticleFromEzineArticles()
    done.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getArticleFromEzineArticles({keyword: ''})
    done.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getArticleFromEzineArticles('keyword')
    done.fail(`didn't throw no keyword property`)
  }
  catch (e) {}
  done()
})
