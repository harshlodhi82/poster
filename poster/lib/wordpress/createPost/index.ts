import log from 'lib/utils/logger'
import WPAPI from 'wpapi'
import download from 'download'

interface CreatePost {
  (createPostSettings: {
    title: string,
    content: string,
    imageUrls: string[],
    categories: string[],
    status: string
  }): Promise<any>
}

// eslint-disable-next-line require-await
const createPost: CreatePost = async function ({title, content, imageUrls, categories, status}) {
  let data = {title, content, imageUrls, categories, status}
  const URL = this.url + 'wp-json'
  const wp = new WPAPI({
    endpoint: URL,
    username: this.username,
    password: this.password,
    auth: true
  })
  try {
    data.categories = await validatingCategoryIds(wp, data.categories)
    const imageData = await uploadImages(wp, data.imageUrls)
    let imageIds = imageData.imageIds
    let uploadedUrls = imageData.uploadedUrls
    data.content = addImage(data.content, uploadedUrls)
    const post = await wp.posts().create(data)
    await assignImageToPost(wp, imageIds, post.id)
    log.info('Post is created with id', post.id)
    return {post, uploadedUrls}
  }
  catch (error) {
    log.info('error: ', error)
  }
}

//* *Validating categories */
//* *Creating new category if sent category not exist */
//* *Return ids of categories */
const validatingCategoryIds = async (wp: WPAPI, categories: string[]): Promise<any[]> => {
  let validCtgIds = []
  for (let index = 0; index < categories.length; index++) {
    const ctg = categories[index]
    let foundCtg = await wp.categories().search(ctg)
    if (foundCtg.length > 0 && validCtgIds.indexOf(foundCtg[0].id) === -1) {
      validCtgIds.push(foundCtg[0].id)
    }
    else {
      let nweCtg = await wp.categories().create({name: ctg})
      validCtgIds.push(nweCtg.id)
    }
  }
  return validCtgIds
}

//* *Uploading Images */
//* *Return Uploaded Image Id to imageIds array */
const uploadImages = async (wp: WPAPI, imageUrls: string[]): Promise<{ imageIds: number[], uploadedUrls: string[] }> => {
  let imageIds: number[] = []
  let uploadedUrls: string[] = []
  for (let index = 0; index < imageUrls.length; index++) {
    const imgUrl = imageUrls[index]
    let arr = imgUrl.split('/')
    let imgName = arr[arr.length - 1]
    let buffImg = await download(imgUrl)
    let uploadedImg = await wp.media().file(buffImg, imgName).create({title: 'Post image'})
    imageIds.push(uploadedImg.id)
    uploadedUrls.push(uploadedImg.source_url)
  }
  return {imageIds, uploadedUrls}
}

//* *Assigning Images to create Post */
const assignImageToPost = async (wp: WPAPI, imageIds: number[], postId): Promise<void> => {
  for (let index = 0; index < imageIds.length; index++) {
    const imgId = imageIds[index]
    await wp.media().id(imgId).update({post: postId})
  }
}

//* *Adding Image to random plac inside content. */
const addImage = (content: string, images: string[]): string => {
  let arr = content.split(' ')
  for (let index = 0; index < images.length; index++) {
    const img = images[index]
    const imgTag = `<img src="${img}"/>`
    const randomNumber = Math.floor(Math.random() * arr.length)
    arr[randomNumber] = arr[randomNumber].concat(imgTag)
  }
  let newContent = arr.join(' ')
  return newContent
}

export default createPost
