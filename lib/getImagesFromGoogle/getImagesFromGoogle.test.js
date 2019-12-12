const test = require('tape')
const getImagesFromGoogle = require('./index')

let proxy
try {
  const {proxy: proxyHost, proxyUsername, proxyPassword} = require('secret/proxy')
  proxy = {proxy: proxyHost, proxyUsername, proxyPassword}
}
catch (e) {}

test('getImagesFromGoogle 3 red flowers', async t => {
  const keyword = '3 red flowers'
  const images = await getImagesFromGoogle({keyword})
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

test('getImagesFromGoogle 3 red flowers with proxy', async t => {
  const keyword = '3 red flowers'
  const images = await getImagesFromGoogle({keyword, proxy})
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

test('getImagesFromGoogle invalid args', async t => {
  try {
    await getImagesFromGoogle({})
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImagesFromGoogle()
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImagesFromGoogle({keyword: ''})
    t.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImagesFromGoogle('keyword')
    t.fail(`didn't throw no keyword property`)
  }
  catch (e) {}

  t.end()
})
