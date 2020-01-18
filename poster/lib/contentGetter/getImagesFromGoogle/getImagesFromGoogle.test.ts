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
  let proxy
  const onProxyRequestMock = jest.fn()
  beforeAll(async () => {
    proxy = await ProxyServer({
      username: 'test',
      password: 'testPass'
    })
    proxy.on('proxyrequest', onProxyRequestMock)
  })
  afterAll(async () => {
    await proxy.close()
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
  test('proxy was used', () => {
    expect(onProxyRequestMock).toHaveBeenCalled()
  })
})

describe('invalid args', () => {
  test(`throws empty keyword`, async () => {
    await expect(getImagesFromGoogle({keyword: ''})).rejects.toThrow()
  })
})
