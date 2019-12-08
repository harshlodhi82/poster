const translate = require('@k3rn31p4nic/google-translate-api')
const log = require('lib/utils/logger')

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
  const username = typeof proxy.proxyUsername === 'undefined' || proxy.proxyUsername.trim() === '' ? '' : proxy.proxyUsername
  const password = typeof proxy.proxyPassword === 'undefined' || proxy.proxyPassword.trim() === '' ? '' : proxy.proxyPassword

  const host = username + ':' + password + '@' + proxy.proxy.split(':')[0]

  const port = typeof proxy.proxy.split(':')[1] === 'undefined' ? 80 : parseInt(proxy.proxy.split(':')[1])

  let translatedText = text

  for (let lang of languages) {
    const result = await translate(translatedText, {to: lang, proxies: [{host: host, port: port}]})
    translatedText = result.text
  }
  log.info(translatedText)
  return translatedText
}

module.exports = getChainedTranslation
