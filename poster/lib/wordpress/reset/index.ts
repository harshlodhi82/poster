import log from 'lib/utils/logger'
import WPAPI from 'wpapi'
import c

interface Reset {
  (): Promise<void>
}

// eslint-disable-next-line require-await
const reset: Reset = async function () {
  /* reset should delete all posts, categories, and medias */
  log.info(this.url, this.username, this.password)
  log.info('Running Here!')

  // let data = {title, content, imageUrls, categories, status}
  const URL = this.url + 'wp-json'
  const wp = new WPAPI({
    endpoint: URL,
    username: this.username,
    password: this.password,
    auth: true
  })
  try {
    let posts = await wp.posts()
    // log.info('posts>>>>', posts)
    for (let index = 0; index < posts.length; index++) {
      const post = posts[index]
      log.info('Deleteing >>>>', post.id)
      await wp.posts().id(post.id).delete()
    }
    // let data =
    // let posts2 = await wp.posts()
    log.info('Deleted >>>>')
  }
  catch (error) {
    log.info('error>>>>', error)
  }
}

export default reset
