const puppeteer = require('puppeteer')
const log = require('lib/utils/logger')

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

    if (option.proxy && typeof option.proxy.proxy !== 'undefined' && option.proxy.proxyUsername) {
      await page.authenticate({
        username: option.proxy.proxyUsername,
        password: option.proxy.proxyPassword
      })
    }

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
        if (imagesNodeList[i].getAttribute('href').length > 1) {
          const tmp1 = imagesNodeList[i].getAttribute('href').split('/imgres?imgurl=')[1]
          const tmp2 = tmp1.split('&imgrefurl=')[0]
          const tmp3 = decodeURIComponent(decodeURIComponent(tmp2))
          firstStageLinks.push(tmp3)
        }
      };

      return firstStageLinks
    })

    await browser.close()
    // log.info(imageLinks)

    return imageLinks
  }
  catch (err) {
    // Catch and display errors
    if (err.message === 'Empty keyword') {
      throw new Error('Empty keyword')
    }
    log.info(err)
    await browser.close()
    log.info('Browser Closed')
  }
}

module.exports = getImages
