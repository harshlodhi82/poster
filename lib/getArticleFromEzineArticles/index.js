import log from 'lib/utils/logger'
import puppeteer from 'puppeteer'
import _ from 'lodash'

const getArticleFromEzineArticles = async (option) => {
  // must search on google `site:ezinearticles.com ${keyword}`
  // do NOT use ezinearticles search
  let browser
  try {
    if (!option || typeof option !== 'object' || typeof option.keyword === 'undefined' || option.keyword.trim().length === 0) {
      throw new Error('Empty keyword')
    }
    const encodedKeyword = encodeURI(option.keyword)

    let proxy_url

    if (option.proxy && typeof option.proxy.proxy !== 'undefined') {
      let host = option.proxy.proxy.split(':')[0]
      const port = option.proxy.proxy.split(':')[1] || 80
      proxy_url = `${host}:${port}`
      browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${proxy_url}`, '--no-sandbox']
      })
    }
    else {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      })
    }

    let page = await browser.newPage()

    if (option.proxy && typeof option.proxy.proxy !== 'undefined' && option.proxy.proxyUsername) {
      await page.authenticate({
        username: option.proxy.proxyUsername,
        password: option.proxy.proxyPassword
      })
    }

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
    await page.setViewport({width: 1200, height: 1200})

    await page.goto(`https://www.google.com/search?q=site%3Aezinearticles.com+${encodedKeyword}&num=20`, {waitUntil: 'load', timeout: 0})

    await page.waitForSelector('.g > div > .rc > .r > a')

    const articles_data = await page.evaluate(() => {
      let data = []
      const articleLinkNodes = document.querySelectorAll('.g > div > .rc > .r > a')

      for (let i = 0; i < articleLinkNodes.length; i++) {
        data[i] = {
          url: articleLinkNodes[i].href,
          id: articleLinkNodes[i].href.split('&id=')[1]
        }
      }

      return data
    })

    await browser.close()

    const articles_links = option.excludeArticleIds ? _.reject(articles_data, (v) => !v.id || _.includes(Array.from(option.excludeArticleIds), v.id)) : articles_data

    const articles = await getArticle(articles_links[0].url, option.proxy)

    return articles
  }
  catch (err) {
    if (err.message === 'Empty keyword') {
      throw new Error('Empty keyword')
    }
    log.info(err)
    await browser.close()
    log.info('Browser Closed')
  }
}

const getArticle = async (link, proxy) => {
  let browser
  try {
    let proxy_url

    if (proxy && typeof proxy.proxy !== 'undefined') {
      let host = proxy.proxy.split(':')[0]
      const port = proxy.proxy.split(':')[1] || 80
      proxy_url = `${host}:${port}`
      browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${proxy_url}`, '--no-sandbox']
      })
    }
    else {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      })
    }

    let page = await browser.newPage()

    if (proxy && typeof proxy.proxy !== 'undefined' && proxy.proxyUsername) {
      await page.authenticate({
        username: proxy.proxyUsername,
        password: proxy.proxyPassword
      })
    }
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
    await page.setViewport({width: 1200, height: 1200})
    await page.goto(link, {waitUntil: 'load', timeout: 0})

    await page.waitForSelector('#article-content')

    const article = await page.evaluate(() => {
      const articleContentNodes = document.querySelectorAll('#article-content')
      const articleTitleNodes = document.querySelectorAll('#article-title')

      const data = {
        articleContent: articleContentNodes[0].innerText,
        articleTitle: articleTitleNodes[0].innerText,
        articleId: document.location.href.split('&id=')[1]
      }
      return data
    })

    await browser.close()

    return article
  }
  catch (err) {
    log.info(err)
    await browser.close()
    log.info('Browser Closed')
  }
}

export default getArticleFromEzineArticles
