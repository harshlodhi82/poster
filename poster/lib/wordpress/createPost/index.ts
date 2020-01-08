import log from 'lib/utils/logger'

interface CreatePost {
  (createPostSettings: {
    title: string,
    content: string,
    imageUrls: string[],
    category: string
  }): Promise<void>
}

// eslint-disable-next-line require-await
const createPost: CreatePost = async function ({title, content, imageUrls, category}) {
  log.info({title, content, imageUrls, category})
  log.info(this.url, this.username, this.password)
}

export default createPost
