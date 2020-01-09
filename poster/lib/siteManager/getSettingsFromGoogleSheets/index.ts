import log from 'lib/utils/logger'
import fetch from 'node-fetch'
import csvParse from 'csv-parse'

interface GoogleSheetRow {
  [columnName: string]: string
}

interface GetSettingsFromGoogleSheets {
  (getSettingsFromGoogleSheetsSettings: {
    url: string,
  }): Promise<GoogleSheetRow[]>
}

// eslint-disable-next-line require-await
const getSettingsFromGoogleSheets: GetSettingsFromGoogleSheets = async ({url}) => {
  const csvString = await fetch(`${url}/export?gid=0&format=csv`).then(res => res.text())
  log.info(csvString)

  return [{}, {}, {}]
}

export default getSettingsFromGoogleSheets
