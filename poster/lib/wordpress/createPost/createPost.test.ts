import createPost from './index'
import credentials from '../fixtures/credentials'
import fetch from 'node-fetch'

const content = `The horse (Equus ferus caballus)[2][3] is one of two extant subspecies of Equus ferus. It is an odd-toed ungulate mammal belonging to the taxonomic family Equidae. The horse has evolved over the past 45 to 55 million years from a small multi-toed creature, Eohippus, into the large, single-toed animal of today. Humans began domesticating horses around 4000 BC, and their domestication is believed to have been widespread by 3000 BC. Horses in the subspecies caballus are domesticated, although some domesticated populations live in the wild as feral horses. These feral populations are not true wild horses, as this term is used to describe horses that have never been domesticated, such as the endangered Przewalski's horse, a separate subspecies, and the only remaining true wild horse. There is an extensive, specialized vocabulary used to describe equine-related concepts, covering everything from anatomy to life stages, size, colors, markings, breeds, locomotion, and behavior.

Horses are adapted to run, allowing them to quickly escape predators, possessing an excellent sense of balance and a strong fight-or-flight response. Related to this need to flee from predators in the wild is an unusual trait: horses are able to sleep both standing up and lying down, with younger horses tending to sleep significantly more than adults.[4] Female horses, called mares, carry their young for approximately 11 months, and a young horse, called a foal, can stand and run shortly following birth. Most domesticated horses begin training under saddle or in harness between the ages of two and four. They reach full adult development by age five, and have an average lifespan of between 25 and 30 years.
`

test('createPost', async () => {
  const wordpress = {
    createPost,
    ...credentials
  }
  Object.freeze(wordpress)
  const settings = {
    imageUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/440px-Nokota_Horses_cropped.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Horse-and-pony.jpg/620px-Horse-and-pony.jpg'
    ],
    title: 'Why Horses Are Great',
    content,
    categories: ['category'],
    status: 'publish'
  }
  const response: any = await wordpress.createPost(settings)
  const createdPost = response.post
  const uploadedImgs = response.uploadedUrls
  const postRes = await fetch(createdPost.link)
  const postHtml = await postRes.text()
  expect(createdPost.type).toEqual('post')
  expect(createdPost.title.raw).toEqual(settings.title)
  expect(createdPost.categories.length).toEqual(settings.categories.length)
  expect(createdPost.slug).toMatch('why-horses-are-great')
  expect(postHtml).toMatch(settings.title)
  expect(postRes.ok).toEqual(true)
  expect(postRes.status).toEqual(200)
  expect(postHtml).toMatch('440px-Nokota_Horses_cropped')
  expect(postHtml).toMatch('620px-Horse-and-pony')
  expect(postHtml).not.toMatch('wikimedia.org')

  //* *Testing Images */
  for (let index = 0; index < uploadedImgs.length; index++) {
    const imgUrl = uploadedImgs[index]
    const imgRes = await fetch(imgUrl)
    expect(postHtml).toMatch(`<img src="${imgUrl}"/>`)
    expect(imgRes.status).toEqual(200)
  }
})
