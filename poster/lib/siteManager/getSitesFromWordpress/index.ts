import log from 'lib/utils/logger'
import fetch from 'node-fetch'

interface GetSitesFromWordpress {
  (getSitesFromWordpressSettings: {
    url: string,
  }): Promise<string[]>
}

// eslint-disable-next-line require-await
const getSitesFromWordpress: GetSitesFromWordpress = async ({url}) => {
  const sites = await fetch(`${url}/wp-json/wp/v2/sites`).then(res => res.json())
  log.info(sites)

  return ['', '', '']
}

export default getSitesFromWordpress
