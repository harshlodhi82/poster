interface PostToDo {
  keyword: string
  site: string
}

interface SiteSettings {
  s: string
  keywords: string[]
}

type SitesSettings = SiteSettings[]

type Sites = string[]

export {
  PostToDo, SiteSettings, SitesSettings, Sites
}
