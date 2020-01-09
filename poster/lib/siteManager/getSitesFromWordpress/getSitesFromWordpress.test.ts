import getSitesFromWordpress from './index'
import fixtures from '../fixtures'

test('getSitesFromWordpress', async () => {
  await getSitesFromWordpress({url: fixtures.WORDPRESS_URL})
  throw Error('TODO')
})
