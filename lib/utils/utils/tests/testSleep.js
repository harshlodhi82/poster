import utils from '../index'
const {sleep} = utils

const test = async () => {
  console.log(5000)
  await sleep(5000)
  console.log(5000, 10000)
  await sleep(5000, 10000)
  await sleep(5000, {countdown: true})
  await sleep(5000, {countdown: true, debugCountdown: true})
  await sleep(5000, 10000, {countdown: true})
  await sleep(5000, 10000, {countdown: true, debugCountdown: true})
}
test()
