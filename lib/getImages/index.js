const log = require('lib/utils/logger')
const puppeteer = require('puppeteer')
var fs = require('fs')

const getImages = async (option) => {
  let browser
  try {
    if (!option || typeof option !== 'object' || typeof option.keyword === 'undefined' || option.keyword.trim().length === 0) {
      throw new Error('Empty keyword')
    }

    const encoded_keyword = encodeURI(option.keyword)

    let proxy_url

    if (option.proxy && typeof option.proxy.proxy !== 'undefined') {
      let host = option.proxy.proxy.split(':')[0]
      const port = option.proxy.proxy.split(':')[1] || 80

      if (option.proxy.proxyUsername) {
        host = `${option.proxy.proxyUsername}:${option.proxy.proxyPassword}@${host}`
      }

      proxy_url = `${host}:${port}`
      console.log(proxy_url)
      browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${proxy_url}`]
      })
    }
    else {
      browser = await puppeteer.launch({
        headless: true
      })
    }

    let page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
    await page.setViewport({
      width: 1200,
      height: 1200
    })
    await page.goto(`https://www.google.com/search?tbm=isch&q=${encoded_keyword}`)
    await page.waitForSelector('div.rg_bx.rg_di.rg_el.ivg-i > a.rg_l')

    let imageLinks = await page.evaluate(() => {
      let imagesNodeList = document.querySelectorAll('div.rg_bx.rg_di.rg_el.ivg-i > a.rg_l')

      let firstStageLinks = []

      for (let i = 0; i < imagesNodeList.length; i++) {
        // firstStageLinks[i] = 'https://google.com' + imagesNodeList[i].getAttribute('href')
        if (imagesNodeList[i].getAttribute('href').length > 1) {
          firstStageLinks.push('https://google.com' + imagesNodeList[i].getAttribute('href'))
        }
      };

      return firstStageLinks
    })

    await browser.close()

    let links = []
    for (let i = 0; i < imageLinks.length; i++) {
      // console.log(i + 1)
      const link = await scrapImage(imageLinks[i], option.proxy)
      if (link) {
        // console.log(link)
        links.push(link)
      }
    }

    return links
  }
  catch (err) {
    // Catch and display errors
    if (err.message === 'Empty keyword') {
      throw new Error('Empty keyword')
    }
    console.log(err)
    await browser.close()
    console.log('Browser Closed')
  }
}

const scrapImage = async (link, proxy) => {
  if (link.length === 0) {
    return []
  }
  let browser
  try {
    let proxy_url

    if (proxy && typeof proxy.proxy !== 'undefined') {
      let host = proxy.proxy.split(':')[0]
      const port = proxy.proxy.split(':')[1] || 80

      if (proxy.proxyUsername) {
        host = `${proxy.proxyUsername}:${proxy.proxyPassword}@${host}`
      }

      proxy_url = `${host}:${port}`

      browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${proxy_url}`]
      })
    }
    else {
      browser = await puppeteer.launch({
        headless: true
      })
    }

    let page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
    await page.setViewport({
      width: 1200,
      height: 1200
    })
    await page.goto(link)

    await page.waitForSelector('div.KkFss > img.irc_mi')

    let imageLink = await page.evaluate(() => {
      let imagesLinkNodeList = document.querySelectorAll('div.KkFss > img.irc_mi')
      const imageSrc = imagesLinkNodeList[1].getAttribute('src')

      return imageSrc
    })

    await browser.close()

    // console.log('Browser Closed')
    return imageLink
  }
  catch (err) {
    console.log(err)
    await browser.close()
    console.log('Browser Closed')
  }
}

module.exports = getImages
