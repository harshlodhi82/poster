import log from 'lib/utils/logger'
import {PostToDo} from '../interfaces'

interface GetPostsToDo {
  (): Promise<PostToDo[]>
}

// eslint-disable-next-line require-await
const getPostsToDo: GetPostsToDo = async function () {
  // get sites
  // get google sheets settings
  // get posts to do from site settings
  return [{keyword: '', site: ''}, {keyword: '', site: ''}, {keyword: '', site: ''}]
}

export default getPostsToDo
