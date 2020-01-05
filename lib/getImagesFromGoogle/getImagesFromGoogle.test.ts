import getImagesFromGoogle from './index'
import ProxyServer from 'lib/utils/ProxyServer'

test('getImagesFromGoogle 3 red flowers', async () => {
  const keyword = '3 red flowers'
  const images = await getImagesFromGoogle({keyword})
  expect(Array.isArray(images)).toBeTruthy()
  expect(images.length > 10).toBeTruthy()
  for (const image of images) {
    expect(typeof image === 'string').toBeTruthy()
  }
})

describe('with bad proxy', () => {
  /* this test emulates a connection using a bad proxy
  the connection drops 50% of the time.
  use DEBUG=proxy env to see what the proxy does */
  let proxy
  const onProxyRequestMock = jest.fn()
  beforeAll(async () => {
    proxy = await ProxyServer({
      username: 'test',
      password: 'testPass',
      dropRate: 0.5,
      throttleRate: 0.5
    })
    proxy.on('proxyrequest', onProxyRequestMock)
  })
  afterAll(async () => {
    await proxy.close()
    // make sure proxy was used
    expect(onProxyRequestMock.mock.calls.length).toBeGreaterThan(1)
  })
  test('getImagesFromGoogle 3 red flowers', async () => {
    const keyword = '3 red flowers'
    const images = await getImagesFromGoogle({keyword,
      proxy: {
        host: proxy.host,
        username: proxy.username,
        password: proxy.password
      }})
    expect(Array.isArray(images)).toBeTruthy()
    expect(images.length > 10).toBeTruthy()
    for (const image of images) {
      expect(typeof image === 'string').toBeTruthy()
    }
  })
})
