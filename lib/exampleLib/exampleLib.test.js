const test = require('tape')
const LibExample = require('./index')
let libExample

const someDependency = {hello: 'world'}

test('libExample set up', t => {
  libExample = LibExample({someDependency})
  t.end()
})

test('libExample.getSomeDependency', t => {
  const res = libExample.getSomeDependency()
  t.deepEqual(res, someDependency, 'returns someDependency')
  t.end()
})
