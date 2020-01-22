import log from 'lib/utils/logger'
import puppeteer from 'puppeteer'
import _ from 'lodash'

interface ProxySettings {
  host: string
  username?: string
  password?: string
}

interface GetChainedTranslation {
  (getChainedTranslationSettings: {
    text: string,
    languages: string[],
    proxy?: ProxySettings
  }): Promise<string>
}

//* *Get Chained Translation */
const getChainedTranslation: GetChainedTranslation = async ({ text, languages, proxy }) => {
  if (text.trim().length === 0 || languages.length === 0) {
    throw new Error('Invalid arguments.')
  }
  const launchOptions = launchOptionsDecider(proxy)
  let newText = text
  let fromLanguage = 'auto'
  for (let index = 0; index < languages.length; index++) {
    const toLanguage = languages[index]
    newText = await translator(launchOptions, proxy, newText, fromLanguage, toLanguage)
    fromLanguage = toLanguage
  }
  return newText
}

//* *Translate Helper */
const translator = async (launchOptions, proxy, text, fromLanguage, toLanguage): Promise<string> => {
  const browser = await puppeteer.launch(launchOptions)
  try {
    const page = await browser.newPage()
    if (proxy && typeof proxy.host !== 'undefined' && proxy.username) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.password
      })
    }
    await page.goto(`https://translate.google.com/#view=home&op=translate&sl=${fromLanguage}&tl=${toLanguage}`)
    await page.waitForSelector('#source')
    await page.evaluate((data) => {
      document.querySelector(data.selector).value = data.value
    }, { selector: "#source", value: text })
    await page.waitForSelector('.result-shield-container')
    const translatedResult = await page.evaluate(() => {
      return document.querySelectorAll('.result-shield-container')[0].textContent
    })
    log.info(`Translated ${fromLanguage} > ${toLanguage} : ${translatedResult}`)
    await browser.close()
    return translatedResult
  } catch (error) {
    await browser.close()
    throw error
  }
}

//* *Launch Options Decider */
const launchOptionsDecider = (proxy) => {
  let proxy_url
  if (proxy && typeof proxy.host !== 'undefined') {
    let host = proxy.host.split(':')[0]
    const port = proxy.host.split(':')[1] || 80
    proxy_url = `${host}:${port}`
    return {
      headless: true,
      args: [`--proxy-server=${proxy_url}`, '--no-sandbox']
    }
  }
  else {
    return {
      headless: true,
      args: ['--no-sandbox']
    }
  }
}

export default getChainedTranslation
