import puppeteer from 'puppeteer'
import log from 'lib/utils/logger'

interface ProxySettings {
  host: string
  username?: string
  password?: string
}

const getImagesFromGoogle = async (options: {keyword: string; proxy?: ProxySettings}): Promise<string[]> => {
  let browser
  try {
    const encoded_keyword = encodeURI(options.keyword)

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

    return imageLinks
  }
  catch (err) {
    log.info(err)
    await browser.close()
    log.info('Browser Closed')
  }
}

export default getImagesFromGoogle
