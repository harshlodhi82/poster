import translate from '@k3rn31p4nic/google-translate-api'

const getChainedTranslation = async ({
  proxy,
  languages,
  text
}) => {
  if (languages.length === 0) {
    throw new Error('Empty Language')
  }
  if (text.trim().length === 0) {
    throw new Error('Empty Text')
  }

  let proxies

  if (proxy) {
    let host = proxy.proxy.split(':')[0]
    const port = proxy.proxy.split(':')[1] || 80

    if (proxy.proxyUsername) {
      host = `${proxy.proxyUsername}:${proxy.proxyPassword}@${host}`
    }

    proxies = [{host, port}]
  }
  let translatedText = text

  for (let lang of languages) {
    const result = await translate(translatedText, {to: lang, proxies})
    translatedText = result.text
  }
  return translatedText
}

export default getChainedTranslation
