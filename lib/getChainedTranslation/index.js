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
  let translatedText = text

  for (let lang of languages) {
    const result = await translate(translatedText, {to: lang, proxies: [{host: 'user-38159:0b5841d139db937e@23.27.255.44', port: 1212}]})
    translatedText = result.text
  }
  log.info(translatedText)
  return translatedText
}

module.exports = getChainedTranslation
