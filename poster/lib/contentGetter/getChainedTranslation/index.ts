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

// eslint-disable-next-line require-await
const getChainedTranslation: GetChainedTranslation = async ({text, languages, proxy}) => {
  return ''
}

export default getChainedTranslation
