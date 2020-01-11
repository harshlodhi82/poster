import getSitesFromWordpress from './index'
import fixtures from '../fixtures'

test('getSitesFromWordpress', async () => {
  const res = await getSitesFromWordpress({url: fixtures.WORDPRESS_URL})
  expect(res).toEqual(['site-1', 'red-cat', 'orange-dog', 'blue-bird'])
})
