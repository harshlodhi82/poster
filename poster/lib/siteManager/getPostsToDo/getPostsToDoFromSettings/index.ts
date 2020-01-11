import log from 'lib/utils/logger'
import {PostToDo, SiteSettings} from '../../interfaces'

interface GetPostsToDoFromSettings {
  (settings: {
    sites: string[],
    sitesSettings: SiteSettings[]
  }): Promise<PostToDo[]>
}

// eslint-disable-next-line require-await
const getPostsToDoFromSettings: GetPostsToDoFromSettings = async ({sites, sitesSettings}) => {
  let postToDoArray = []
  sitesSettings.forEach(elementOfSiteSettings => {
    let numberOfCoincidences = 0
    sites.forEach(site => {
      if (site.includes(elementOfSiteSettings.s) === true) {
        numberOfCoincidences = numberOfCoincidences + 1
        let randomKeywordNumber = Math.floor(Math.random() * elementOfSiteSettings.keywords.length)
        let randomKeywordFromArray = elementOfSiteSettings.keywords[randomKeywordNumber]
        let matchedSiteWithKeyword = {keyword: randomKeywordFromArray, site: site}
        postToDoArray.push(matchedSiteWithKeyword)
      }
    })
    if (numberOfCoincidences > 1 && numberOfCoincidences !== 0) {
      throw new Error('ERROR!')
    }
  })

  log.info({sites, sitesSettings})
  return postToDoArray
}

export default getPostsToDoFromSettings
