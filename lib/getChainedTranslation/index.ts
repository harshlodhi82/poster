import translate from '@k3rn31p4nic/google-translate-api'
import log from 'lib/utils/logger'

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

const getChainedTranslation: GetChainedTranslation = async ({text, languages, proxy}) => {
  if (languages.length === 0) {
    throw new Error('Empty Language')
  }
  if (text.trim().length === 0) {
    throw new Error('Empty Text')
  }

  let proxies

  if (proxy) {
    let host = proxy.host.split(':')[0]
    const port = proxy.host.split(':')[1] || 80

    if (proxy.username) {
      host = `${proxy.username}:${proxy.password}@${host}`
    }

    proxies = [{host, port}]
  }
  let translatedText = text

  for (let lang of languages) {
    const result = await translate(translatedText, {to: lang, proxies})
    translatedText = result.text
    log.info(translatedText)
  }
  return translatedText
}

export default getChainedTranslation
