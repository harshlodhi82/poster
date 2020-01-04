import {withRetry, sleep, waitForOne, withTimeout} from './index'

test('utils.withRetry retries x times', async () => {
  let counter = 0
  let func = () => {
    counter++
    throw Error('error')
  }
  func = withRetry(3)(func)
  await func()
  expect(counter).toBe(4)

  // retry and throw
  counter = 0
  func = () => {
    counter++
    throw Error('error')
  }
  func = withRetry(3, {throwOnFail: true})(func)

  let hasThrown
  try {
    await func()
  }
  catch (e) {
    hasThrown = true
  }
  expect(hasThrown).toBeTruthy()
  expect(counter).toBe(4)
})

test('utils.sleep', async () => {
  const start = 10
  const end = 20
  await sleep(start)
  await sleep(start, {countdown: true})
  await sleep(start, {countdown: true, debugCountdown: true})
  await sleep(start, end)
  await sleep(start, end, {countdown: true})
  await sleep(start, end, {countdown: true, debugCountdown: true})
})

test('utils.withRetry retries x times', async () => {
  let counter = 0
  let func = () => {
    counter++
    throw Error('error')
  }
  func = withRetry(3)(func)
  await func()
  expect(counter).toBe(4)

  // retry and throw
  counter = 0
  func = () => {
    counter++
    throw Error('error')
  }
  func = withRetry(3, {throwOnFail: true})(func)

  let hasThrown
  try {
    await func()
  }
  catch (e) {
    hasThrown = true
  }
  expect(hasThrown).toBeTruthy()
  expect(counter).toBe(4)
})

test('utils.waitForOne', async done => {
  let count = 10
  await waitForOne(
    () => !count--,
    () => {},
    () => {},
    {timeout: 100, pollTime: 1}
  )
  count = 10
  await waitForOne(
    [() => {}, () => {}, () => !count--],
    {timeout: 100, pollTime: 1}
  )
  try {
    count = 10
    await waitForOne(
      () => !count--,
      () => {},
      () => {},
      {timeout: 5, pollTime: 1}
    )
    done.fail()
  }
  catch (e) {}
  try {
    count = 10
    await waitForOne(
      () => {},
      () => {
        throw Error('test')
      }
    )
    done.fail()
  }
  catch (e) {
    expect(e.message).toBe('test')
  }
  done()
})

test('utils.withTimeout', async done => {
  // fast function
  const fastFunction = async (...args) => {
    await new Promise(resolve => setTimeout(resolve, 50))
    return args
  }
  const fastFunctionWithTimeout = withTimeout(100)(fastFunction)
  const res = await fastFunctionWithTimeout(1, 2, 3, 4)
  expect(res).toEqual([1, 2, 3, 4])

  // slow function
  const slowFunction = async (...args) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return args
  }
  const slowFunctionTimeout = withTimeout(100)(slowFunction)
  try {
    await slowFunctionTimeout(1, 2, 3, 4)
    done.fail('slowFunction should timeout error')
  }
  catch (e) {
    expect(e.message.match('timeout exceeded')).toBeTruthy()
  }

  // sync function should throw
  // const syncFunction = (...args) => {
  //   return args
  // }
  // t.throws(() => {
  //   const syncFunctionTimeout = withTimeout(100)(syncFunction)
  //   syncFunctionTimeout()
  // })

  // fast function that throws before timeout exceeded
  const fastFunctionThatThrows = async (...args) => {
    await new Promise(resolve => setTimeout(resolve, 50))
    throw Error(args.join(' '))
  }
  const fastFunctionThatThrowsWithTimeout = withTimeout(100)(fastFunctionThatThrows)
  try {
    await fastFunctionThatThrowsWithTimeout(1, 2, 3, 4)
    done.fail('fastFunctionThatThrows should throw')
  }
  catch (e) {
    expect(e.message).toBe('1 2 3 4')
  }
  done()
})
