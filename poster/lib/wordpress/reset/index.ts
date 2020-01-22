import log from 'lib/utils/logger'
import WPAPI from 'wpapi'

interface Reset {
  (): Promise<any>
}

// eslint-disable-next-line require-await
const reset: Reset = async function () {
  const URL = this.url + 'wp-json'
  const wp = new WPAPI({
    endpoint: URL,
    username: this.username,
    password: this.password,
    auth: true
  })
  let posts = await wp.posts()
  let allMedia = await wp.media()
  let categories = await wp.categories()
  await deleteHelper(posts, wp, 0) // delete post
  await deleteHelper(allMedia, wp, 1) // delete media
  await deleteHelper(categories, wp, 2) // delete categories
  return { wp, posts, allMedia, categories }
}


//* *Delete the Post, Media, Categories acording to type 0, 1, 2 respectivly */
const deleteHelper = async (dataArr: any[], wp: any, type: number): Promise<void> => {
  for (let index = 0; index < dataArr.length; index++) {
    const data = dataArr[index]
    log.info('Deleteing >>>>', data.id)
    switch (type) {
      case 0:
        await wp.posts().id(data.id).delete()
        break
      case 1:
        await wp.media().id(data.id).delete()
        break
      case 2:
        if (data.id !== 1) await wp.categories().id(data.id).param('force', true).delete()
        break
    }
  }
}

export default reset
