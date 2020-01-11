import {Sites, SitesSettings} from '../interfaces'

const sites: Sites = [
  'red-cat',
  'orange-dog',
  'blue-bird',
  'grey-elephant',
  'yellow-mouse'
]

const sitesSettings: SitesSettings = [
  {
    s: 'red-ca',
    keywords: ['cat', 'cats', 'big cats']
  },
  {
    s: 'orang',
    keywords: ['dog', 'dogs', 'big dogs', 'small dogs']
  },
  {
    s: 'yel',
    keywords: ['mouse', 'mice']
  }
]

const fixtures = {
  GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/1B8yq64Ba4WIMwD9LCPJ-1g6qfXwp9yL8WjmZ1bG2tSc',
  WORDPRESS_URL: 'http://wordpress-test/',
  sites,
  sitesSettings
}

export default fixtures
