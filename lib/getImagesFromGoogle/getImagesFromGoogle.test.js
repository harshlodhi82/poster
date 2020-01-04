import getImagesFromGoogle from './index'

let proxy
try {
  const {proxy: proxyHost, proxyUsername, proxyPassword} = require('secret/proxy')
  proxy = {proxy: proxyHost, proxyUsername, proxyPassword}
}
catch (e) {}

test('getImagesFromGoogle 3 red flowers', async () => {
  const keyword = '3 red flowers'
  const images = await getImagesFromGoogle({keyword})
  expect(Array.isArray(images)).toBeTruthy()
  expect(images.length > 10).toBeTruthy()
  for (const image of images) {
    expect(typeof image === 'string').toBeTruthy()
  }
})

test('getImagesFromGoogle 3 red flowers with proxy', async () => {
  const keyword = '3 red flowers'
  const images = await getImagesFromGoogle({keyword, proxy})
  expect(Array.isArray(images)).toBeTruthy()
  expect(images.length > 10).toBeTruthy()
  for (const image of images) {
    expect(typeof image === 'string').toBeTruthy()
  }
})

test('getImagesFromGoogle invalid args', async done => {
  try {
    await getImagesFromGoogle({})
    done.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImagesFromGoogle()
    done.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImagesFromGoogle({keyword: ''})
    done.fail(`didn't throw no keyword`)
  }
  catch (e) {}

  try {
    await getImagesFromGoogle('keyword')
    done.fail(`didn't throw no keyword property`)
  }
  catch (e) {}
  done()
})
