// import log from 'lib/utils/logger'
// import fetch from 'node-fetch'

// enum SiteStatus {
//   GOOD = 'GOOD',
//   BAD = 'BAD'
// }

// interface SiteStatuses {
//   [site: string]: SiteStatus
// }

// interface CheckSitesHealth {
//   (sites: string[]): Promise<SiteStatuses>
// }

// const checkSitesHealth: CheckSitesHealth = async (sites => {
//   const sites = await fetch(`${url}/wp-json/wp/v2/sites`).then(res => res.json())
//   const multisites = []
//   for (const site of sites) {
//     if (site !== '') {
//       multisites.push(site)
//     }
//   }
//   log.info(multisites)
//   return multisites
// }

// export default getSitesFromWordpress
