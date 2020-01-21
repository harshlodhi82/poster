import getChainedTranslation from './index'
import ProxyServer from 'lib/utils/ProxyServer'

const originalText = `Life being what it is will always demand sacrifices from us and in truth, making such sacrifices is one of those things that make us retain all the vestiges of humanity in us even when the natural tendency is to be bestial even if for a little while.

The intriguing thing though is that sometimes we trust too much but the question is what other options are open to us? Must we look upon everyone we meet through the veneer of distrust and hate just because we have chosen to live life as loners who naturally find running away from others enjoyable? Must we choose to see only the evil in others and close our eyes to the good that is in them just because we have had some bitter experiences in the past and do not want our fingers burnt again? These are questions, questions and certainly more questions which beg for answers every day of our lives.

What happens then when our trust is betrayed by others friends and strangers alike? As passengers, we trust the operators of public transport to provide the services for which we pay them and not for them to make it a habit of stopping halfway through the journey blaming one of many possible reasons, engine-related or not. As citizens of a nation say Nigeria, we trust our elected officials and political office holders to provide us with the so-called dividends of democracy and thus make life better for us. As patients we trust our medical doctors and other medical personnel to provide us with the best health care within the ambit of their professional calling. As spouses and lovers, we trust our partners and significant others to make sure they do all the right things at the right time to sustain our relationships. As students we trust our teachers and lecturers to teach us the right things and to set good examples always.

Trust is one of the fundamental virtues of human life that we just cannot do without and whether or not our trust is kept we just must trust because that is the foundation of corporate existence in the first place. Undoubtedly the best situations are such that trust is not betrayed by the recipient but for that to be so, everyone who is trusted to do something must make sure they give a good account of themselves as far as holding that trust is concerned.

The way I see it, we must always trust in people whether or not we are going to get that trust held in high esteem. It reminds me of the enigma of love and of the possible implications of love that is unrequited. The possibilities are endless if we can all learn to trust one another and if those of us who are seen as worthy of another's trust do our best to remain true to that trust. So even if you have had bitter experiences, do not be afraid to try again!`

test('getChainedTranslation 3 languages', async () => {
  const languages = ['es', 'fr', 'en']
  const chainedTanslation = await getChainedTranslation({languages, text: originalText})
  expect(typeof chainedTanslation === 'string').toBeTruthy()
  expect(chainedTanslation && chainedTanslation.length > 100).toBeTruthy()
})

describe('with bad proxy', () => {
  let proxy
  const onProxyRequestMock = jest.fn()
  beforeAll(async () => {
    proxy = await ProxyServer({
      username: 'test',
      password: 'testPass'
    })
    proxy.on('proxyrequest', onProxyRequestMock)
  })
  afterAll(async () => {
    await proxy.close()
  })
  test('getChainedTranslation 3 languages', async () => {
    // const languages = ['es', 'fr', 'en']
    const languages = ['es']
    const chainedTanslation = await getChainedTranslation({
      languages,
      text: originalText,
      proxy: {
        host: proxy.host,
        username: proxy.username,
        password: proxy.password
      }
    })
    expect(typeof chainedTanslation === 'string').toBeTruthy()
    expect(chainedTanslation && chainedTanslation.length > 100).toBeTruthy()
  })
  test('proxy was used', () => {
    expect(onProxyRequestMock).toHaveBeenCalled()
  })
})

test('getChainedTranslation 6 languages', async () => {
  const languages = ['es', 'fr', 'en', 'th', 'th', 'en']
  const chainedTanslation = await getChainedTranslation({languages, text: originalText})
  expect(typeof chainedTanslation === 'string').toBeTruthy()
  expect(chainedTanslation && chainedTanslation.length > 100).toBeTruthy()
})

describe('invalid args', () => {
  test(`throws 0 languages`, async () => {
    await expect(getChainedTranslation({
      languages: [],
      text: originalText
    })).rejects.toThrow()
  })
  test(`throws empty text`, async () => {
    await expect(getChainedTranslation({
      languages: ['es', 'en'],
      text: ''
    })).rejects.toThrow()
  })
})
