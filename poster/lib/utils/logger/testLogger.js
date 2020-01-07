import log from 'lib/utils/logger'
log.addFile({file: 'loggerTest'})
log.addElasticsearch({index: 'logger-test', extraProp: 'logger-test'})

log.info('new set', new Set([1, 2, 3]))
log.info('new map', new Map([[1, 1], [2, 2], [3, 3]]))

log.setProperty('setProp', 'setProp')

log.info('test message')

log.info([{password: 1234}])

log.info(`${'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test '} "test2" 'test3'`, '`test4`')

log.info('test', {testProp: 'tested'})

log.info([1, 2, 3, 4, 5])

log.info({test: {test: [1, 2, 3, 4, 5]}})

log.info('test1', {test2: {test3: [1, 2, 3, 4, 5]}})

// throw Error('logger error')
// setTimeout(() => {
//   throw Error('logger error')
// })
// setTimeout(async () => {
//   setInterval(() => {
//     log.info('interval')
//   }, 55)
//   throw Error('logger error')
//   await new Promise(resolve => {})
// }, 2000)
// setInterval(() => {}, 55)

log.info({
  args: [
    '--no-sandbox',
    '--disable-infobars',
    '--disable-reading-from-canvas',
    '--user-data-dir=/Users/dave/Documents/git/bot/tmp/profiles/1234@gmail.com',
    '--proxy-server=proxy.packetstream.io:31112',
    '--window-size=817,754'
  ],
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false
})

const testFunction = () => {
  log.info('test')

  log.error(new Error('Test!'))
}
testFunction()

log.info({url: 'http://admin:pass1234@127.0.0.1:9200'})
