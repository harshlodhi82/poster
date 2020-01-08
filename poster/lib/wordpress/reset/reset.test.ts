import reset from './index'
import credentials from '../fixtures/credentials'

test('reset', async () => {
  const wordpress = {
    reset,
    ...credentials
  }
  Object.freeze(wordpress)
  await wordpress.reset()
})
