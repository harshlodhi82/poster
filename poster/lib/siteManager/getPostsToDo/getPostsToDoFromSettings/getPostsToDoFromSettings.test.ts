import getPostsToDoFromSettings from './index'
import fixtures from '../../fixtures'

test('getPostsToDoFromSettings', async () => {
  const settings = {
    sites: fixtures.sites,
    sitesSettings: fixtures.sitesSettings
  }
  const postsToDo = await getPostsToDoFromSettings(settings)
  expect(postsToDo).toHaveLength(3)
  for (const post of postsToDo) {
    expect(post.site).toBeTruthy()
    expect(post.keyword).toBeTruthy()
  }
})

test('should throw when site settings matches multiple sites', async () => {
  const settings = {
    sites: ['blue-cat', 'blue-bird'],
    sitesSettings: [{s: 'blue', keywords: ['keyword']}]
  }
  await expect(getPostsToDoFromSettings(settings)).rejects.toThrow()
})
