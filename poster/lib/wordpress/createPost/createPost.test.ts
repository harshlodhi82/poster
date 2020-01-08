import createPost from './index'

interface Wordpress {
  createPost: any
  url: string
  username: string
  password: string
}

test('createPost', async () => {
  const wordpress = {
    createPost: createPost,
    url: 'test.com',
    username: 'admin',
    password: 'password'
  }
  Object.freeze(wordpress)
  const settings = {
    imageUrls: ['1', '2'],
    title: 'title',
    content: 'content',
    category: 'category'
  }
  await wordpress.createPost(settings)
})
