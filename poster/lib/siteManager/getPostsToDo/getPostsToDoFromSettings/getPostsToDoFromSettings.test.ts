import getPostsToDoFromSettings from './index'
import fixtures from '../../fixtures'

test('getPostsToDoFromSettings', async () => {
  const settings = {
    sites: fixtures.sites,
    sitesSettings: fixtures.sitesSettings
  }
  await getPostsToDoFromSettings(settings)
  throw Error('TODO')
})

test('should throw when site settings matches multiple sites', async () => {
  const settings = {
    sites: ['blue-cat', 'blue-bird'],
    sitesSettings: [{s: 'blue', keywords: ['keyword']}]
  }
  await expect(getPostsToDoFromSettings(settings)).rejects.toThrow()
})
