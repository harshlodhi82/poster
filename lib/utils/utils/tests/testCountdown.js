import getCountdown from '../countdown'
import {sleep} from '../index'

const test = () => {
  sleep(10000)
  getCountdown(10000)
  getCountdown(3000, 'test 2')
  const c = getCountdown(3000, 'will end')
  c.end()
}
test()
