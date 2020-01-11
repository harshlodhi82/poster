import getSettingsFromGoogleSheets from './index'
import fixtures from '../fixtures'

const multilineCell = `this
is
a
multiline
cell`

test('getSettingsFromGoogleSheets', async () => {
  const expectedRes = [
    {
      site: 'abc',
      test: 'test abc',
      'some other prop': '',
      'some json prop': '',
      'some multiline prop': multilineCell
    },
    {
      site: 'def',
      test: '',
      'some other prop': '',
      'some json prop': '',
      'some multiline prop': ''
    },
    {
      site: 'ghi',
      test: 'test ghi',
      'some other prop': 'some other prop',
      'some json prop': '{"one": "test", "two": "test"}',
      'some multiline prop': ''
    },
    {
      site: 'xyz',
      test: 'test xyz',
      'some other prop': '',
      'some json prop': '',
      'some multiline prop': ''
    }
  ]
  const res = await getSettingsFromGoogleSheets({url: fixtures.GOOGLE_SHEETS_URL})
  expect(res).toEqual(expectedRes)
})
