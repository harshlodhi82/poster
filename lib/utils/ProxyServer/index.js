import http from 'http'
import setup from './proxy'
import Debug from 'debug'
const debug = Debug('proxy')

const createServer = ({
  port = 0,
  username = null,
  password = null,
  dropRate = 0,
  throttleRate = 0,
  throttleRange = [10000, 20000]
} = {}) => {
  const proxy = http.createServer()
  setup(proxy)

  // don't use a special user agent
  proxy.agent = false
  proxy.dropRate = dropRate
  proxy.throttleRate = throttleRate
  proxy.throttleRange = throttleRange

  proxy.authenticate = function (req, fn) {
    const b64auth = (req.headers['proxy-authorization'] || '').split(' ')[1] || ''
    const [requestUsername, requestPassword] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (username && username === requestUsername && password === requestPassword) {
      debug(`authenticated username '${username}'`)
      return fn(null, true)
    }
    debug(`failed authentication username '${requestUsername}'`)
    return fn(null, false)
  }

  proxy.closed = false
  const close = proxy.close.bind(proxy)
  proxy.close = () => new Promise(resolve => close(() => {
    proxy.closed = true
    resolve()
  }))

  return new Promise(resolve => {
    proxy.listen(port, function () {
      console.log(
        'HTTP(s) proxy server listening on port %d',
        this.address().port
      )
      proxy.port = this.address().port
      proxy.hostname = 'localhost'
      proxy.host = `${proxy.hostname}:${proxy.port}`
      proxy.protocol = 'http'
      proxy.username = username
      proxy.password = password
      resolve(proxy)
    })
  })
}

export default createServer
