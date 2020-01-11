import log from 'lib/utils/logger'
import fetch from 'node-fetch'

interface GetSitesFromWordpress {
  (getSitesFromWordpressSettings: {
    url: string,
  }): Promise<string[]>
}

const getSitesFromWordpress: GetSitesFromWordpress = async ({url}) => {
  const sites = await fetch(`${url}/wp-json/wp/v2/sites`).then(res => res.json())
  const multisites = []
  for (const site of sites) {
    if (site !== '') {
      multisites.push(site)
    }
  }
  log.info(multisites)
  return multisites
}

export default getSitesFromWordpress
