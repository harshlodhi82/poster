import log from 'lib/utils/logger'
import WPAPI from 'wpapi'

interface CreatePost {
  (createPostSettings: {
    title: string,
    content: string,
    imageUrls: string[],
    categories: string[]
  }): Promise<void>
}

// eslint-disable-next-line require-await
const createPost: CreatePost = async function ({title, content, imageUrls, categories}) {
  log.info({title, content, imageUrls, categories})
  log.info(this.url, this.username, this.password)
}

export default createPost
