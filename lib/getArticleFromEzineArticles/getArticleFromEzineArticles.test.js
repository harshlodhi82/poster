const test = require('tape')
const getArticleFromEzineArticles = require('./index')

let proxy
try {
  const {proxy: proxyHost, proxyUsername, proxyPassword} = require('secret/proxy')
  proxy = {proxy: proxyHost, proxyUsername, proxyPassword}
}
catch (e) {}

test('getArticleFromEzineArticles 3 red flowers', async t => {
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
  testArticle({t, article, excludeArticleIds})
  t.end()
})

test('getArticleFromEzineArticles 3 red flowers with proxy', async t => {
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
  testArticle({t, article, excludeArticleIds})
  t.end()
})

test('getArticleFromEzineArticles how to tie a tie', async t => {
  const keyword = 'how to tie a tie'
  const article = await getArticleFromEzineArticles({keyword})
  testArticle({t, article})
  t.end()
})

test('getArticleFromEzineArticles fastest computer 2019', async t => {
  const keyword = 'fastest computer 2019e'
  const article = await getArticleFromEzineArticles({keyword})
  testArticle({t, article})
  t.end()
})

const testArticle = ({t, article, excludeArticleIds = new Set()} = {}) => {
  if (typeof article !== 'object') {
    t.fail(`article is not an object`)
    return
  }
  const {articleTitle, articleContent, articleId} = article[0]
  t.ok(typeof articleTitle === 'string', 'articleTitle is string')
  t.ok(articleTitle && articleTitle.length > 20, 'articleTitle has 20+ chars')
  t.ok(typeof articleContent === 'string', 'articleContent is string')
  t.ok(articleContent && articleContent.length > 100, 'articleContent has 100+ chars')
  t.ok(articleId && typeof articleId === 'string', `articleId ${articleId}`)
  t.notOk(excludeArticleIds.has(articleId), `articleId ${articleId} was not excluded`)
}

test('getArticleFromEzineArticles invalid args', async t => {
  try {
    await getArticleFromEzineArticles({})
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getArticleFromEzineArticles()
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getArticleFromEzineArticles({keyword: ''})
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getArticleFromEzineArticles('keyword')
    t.fail(`didn't throw no keyword property`)
  }
  catch (e) {}

  t.end()
})
