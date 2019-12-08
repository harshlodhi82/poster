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
    const result = await translate(translatedText, {to: lang})
    translatedText = result.text
  }
  log.info(translatedText)
  return translatedText
}

module.exports = getChainedTranslation
