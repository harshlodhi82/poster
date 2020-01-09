import getSettingsFromGoogleSheets from './index'
import fixtures from '../fixtures'

test('getSettingsFromGoogleSheets', async () => {
  await getSettingsFromGoogleSheets({url: fixtures.GOOGLE_SHEETS_URL})
  throw Error('TODO')
})
