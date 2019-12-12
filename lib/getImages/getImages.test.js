const test = require('tape')
const getImages = require('./index')

let proxy
try {
  const {proxy: proxyHost, proxyUsername, proxyPassword} = require('secret/proxy')
  proxy = {proxy: proxyHost, proxyUsername, proxyPassword}
}
catch (e) {}

test('getImages 3 red flowers', async t => {
  const keyword = '3 red flowers'
  const images = await getImages({keyword})
  t.ok(Array.isArray(images), 'images is array')
  if (!images) {
    return t.end()
  }
  t.ok(images.length > 10, 'images has more than 10 images')
  for (const image of images) {
    t.ok(typeof image === 'string', image)
  }
  t.end()
})

test('getImages 3 red flowers with proxy', async t => {
  const keyword = '3 red flowers'
  const images = await getImages({keyword, proxy})
  t.ok(Array.isArray(images), 'images is array')
  if (!images) {
    return t.end()
  }
  t.ok(images.length > 10, 'images has more than 10 images')
  for (const image of images) {
    t.ok(typeof image === 'string', image)
  }
  t.end()
})

test('getImages invalid args', async t => {
  try {
    await getImages({})
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImages()
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImages({keyword: ''})
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImages('keyword')
    t.fail(`didn't throw no keyword property`)
  }
  catch (e) {}

  t.end()
})
