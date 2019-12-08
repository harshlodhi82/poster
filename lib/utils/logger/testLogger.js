const log = require('lib/utils/logger')
log.addFile({file: 'loggerTest'})
log.addElasticsearch({index: 'logger-test', loggerName: 'logger-test'})

log.info('test message')

log.info([{password: 1234}])

log.info(`${'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test '} "test2" 'test3'`, '`test4`')

log.info('test', {testProp: 'tested'})

log.info([1, 2, 3, 4, 5])

log.info({test: {test: [1, 2, 3, 4, 5]}})

log.info('test1', {test2: {test3: [1, 2, 3, 4, 5]}})

log.info({
  args: [
    '--no-sandbox',
    '--disable-infobars',
    '--user-data-dir=/Users/john/Documents/git/bot/tmp/profiles/1234@gmail.com',
    '--proxy-server=100.100.100.100:3000',
    '--window-size=500,500'
  ],
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false
})

const testFunction = () => {
  log.info('test')

  log.error(new Error('Test!'))
}
testFunction()

log.info({url: 'http://admin:password1234@127.0.0.1:9999'})
