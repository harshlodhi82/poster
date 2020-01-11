import log from 'lib/utils/logger'
import {PostToDo, SiteSettings} from '../../interfaces'

interface GetPostsToDoFromSettings {
  (settings: {
    sites: string[],
    sitesSettings: SiteSettings[]
  }): Promise<PostToDo[]>
}

const getPostsToDoFromSettings: GetPostsToDoFromSettings = async ({sites, sitesSettings}) => {
  let postToDoArray = []
  sitesSettings.forEach(elementOfSiteSettings => {
    let numberOfCoincidences = 0
    sites.forEach(site => {
      if (site.startsWith(elementOfSiteSettings.s) === true) {
        numberOfCoincidences = numberOfCoincidences + 1
        let randomKeywordNumber = Math.floor(Math.random() * elementOfSiteSettings.keywords.length)
        let randomKeywordFromArray = elementOfSiteSettings.keywords[randomKeywordNumber]
        let matchedSiteWithKeyword = {keyword: randomKeywordFromArray, site: site}
        postToDoArray.push(matchedSiteWithKeyword)
      }
    })
    if (numberOfCoincidences > 1 && numberOfCoincidences !== 0) {
      throw new Error('One of the sites from «sites settings» matches two or more sites')
    }
  })

  log.info({sites, sitesSettings, postToDoArray})
  return postToDoArray
}

export default getPostsToDoFromSettings
