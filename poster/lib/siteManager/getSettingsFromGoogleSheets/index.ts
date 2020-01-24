import log from 'lib/utils/logger'
import fetch from 'node-fetch'
import csvParse from 'csv-parse/lib/sync'

interface GoogleSheetRow {
  [columnName: string]: string
}

interface GetSettingsFromGoogleSheets {
  (getSettingsFromGoogleSheetsSettings: {
    url: string,
  }): Promise<GoogleSheetRow[]>
}

// eslint-disable-next-line require-await
const getSettingsFromGoogleSheets: GetSettingsFromGoogleSheets = async ({ url }) => {
  const csvString = await fetch(`${url}/export?gid=0&format=csv`).then(res => res.text())
  let result = csvParse(csvString, { columns: true, skip_empty_lines: true , skip_lines_with_empty_values :true})
  return result
}

export default getSettingsFromGoogleSheets
