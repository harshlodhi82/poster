import {waitForOne} from '../index'

const test = async () => {
  const doSomething = async () => {}

  await waitForOne(
    () => doSomething(),
    () => doSomething(),
    () => doSomething(),
    () => doSomething(),
    {timeout: 5000}
  )
}
test()
