import createPost from './index'
import credentials from '../fixtures/credentials'

test('createPost', async () => {
  const wordpress = {
    createPost,
    ...credentials
  }
  Object.freeze(wordpress)
  const settings = {
    imageUrls: ['1', '2'],
    title: 'title',
    content: 'content',
    categories: ['category']
  }
  await wordpress.createPost(settings)
  throw Error('TODO')
})
