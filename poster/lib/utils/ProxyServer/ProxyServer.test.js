import ProxyServer from './index'
import fetch from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'
import HttpProxyAgent from 'http-proxy-agent'

const username = 'test'
const password = 'testPass'

test('proxy opens and closes', async () => {
  const proxy = await ProxyServer()
  expect(typeof proxy.port).toBe('number')
  expect(proxy.closed).toBe(false)
  await proxy.close()
  expect(proxy.closed).toBe(true)
})

describe('makes http and https request', () => {
  let proxy
  let proxyUrl
  const onProxyRequestMock = jest.fn()
  beforeAll(async () => {
    proxy = await ProxyServer({username, password})
    proxyUrl = `${proxy.protocol}://${username}:${password}@${proxy.hostname}:${proxy.port}`
    proxy.on('proxyrequest', onProxyRequestMock)
  })
  afterAll(async () => {
    await proxy.close()
  })
  test('http', async () => {
    const agent = new HttpProxyAgent(proxyUrl)
    let res = await fetch('http://example.com', {agent})
    res = await res.text()
    expect(res).toMatch('Example Domain')
  })
  test('https', async () => {
    const agent = new HttpsProxyAgent(proxyUrl)
    let res = await fetch('https://example.com', {agent})
    res = await res.text()
    expect(res).toMatch('Example Domain')
  })
  test('proxyrequest events are emitted', () => {
    for (const onProxyRequestArgs of onProxyRequestMock.mock.calls) {
      expect(onProxyRequestArgs[0]).toMatch('example.com')
    }
    expect(onProxyRequestMock).toHaveBeenCalledTimes(2)
  })
})
