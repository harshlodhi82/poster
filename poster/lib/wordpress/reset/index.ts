import log from 'lib/utils/logger'
import WPAPI from 'wpapi'

interface Reset {
  (): Promise<void>
}

// eslint-disable-next-line require-await
const reset: Reset = async function () {
  /* reset should delete all posts, categories, and medias */
  log.info(this.url, this.username, this.password)
}

export default reset
