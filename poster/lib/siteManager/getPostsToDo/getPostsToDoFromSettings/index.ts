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
  /* algorithm
    1. find which site goes with which sitesSettings (sitesSettings.s is the first few letters of sites)
    2. find a random  keyword from the keywords array
    3. return all the matched PostToDos, do not return if no match
    4. should throw an error if sitesSettings.s can match multisite sites
  */
  log.info({sites, sitesSettings})
  return [{keyword: '', site: ''}, {keyword: '', site: ''}, {keyword: '', site: ''}]
}

export default getPostsToDoFromSettings
