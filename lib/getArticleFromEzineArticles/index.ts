import log from 'lib/utils/logger'
import puppeteer from 'puppeteer'
import _ from 'lodash'

interface ProxySettings {
  host: string
  username?: string
  password?: string
}

interface Article {
  id: string
  title?: string
  content?: string
}

const getArticleFromEzineArticles = async (options: {
  keyword: string,
  proxy?: ProxySettings,
  excludeArticleIds?: Set<string>
}): Promise<Article> => {
  // must search on google `site:ezinearticles.com ${keyword}`
  // do NOT use ezinearticles search
  let browser
  try {
    const encodedKeyword = encodeURI(options.keyword)

    let proxy_url

    if (options.proxy && typeof options.proxy.host !== 'undefined') {
      let host = options.proxy.host.split(':')[0]
      const port = options.proxy.host.split(':')[1] || 80
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

    if (options.proxy && typeof options.proxy.host !== 'undefined' && options.proxy.username) {
      await page.authenticate({
        username: options.proxy.username,
        password: options.proxy.password
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
          // @ts-ignore
          url: articleLinkNodes[i].href,
          // @ts-ignore
          id: articleLinkNodes[i].href.split('&id=')[1]
        }
      }

      return data
    })

    await browser.close()

    const articles_links = options.excludeArticleIds ? _.reject(articles_data, (v) => !v.id || _.includes(Array.from(options.excludeArticleIds), v.id)) : articles_data

    const articles = await getArticle(articles_links[0].url, options.proxy)

    return articles
  }
  catch (err) {
    log.info(err)
    await browser.close()
    log.info('Browser Closed')
  }
}

const getArticle = async (link, proxy) => {
  let browser
  try {
    let proxy_url

    if (proxy && typeof proxy.host !== 'undefined') {
      let host = proxy.host.split(':')[0]
      const port = proxy.host.split(':')[1] || 80
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

    if (proxy && typeof proxy.host !== 'undefined' && proxy.username) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.password
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
        // @ts-ignore
        articleContent: articleContentNodes[0].innerText,
        // @ts-ignore
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
