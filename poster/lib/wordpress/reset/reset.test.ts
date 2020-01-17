import reset from './index'
import credentials from '../fixtures/credentials'
import createPost from '../createPost'

test('reset', async () => {
  const wordpress = {
    reset,
    createPost,
    ...credentials
  }
  Object.freeze(wordpress)
  await wordpress.reset()
  throw Error('TODO')
})
