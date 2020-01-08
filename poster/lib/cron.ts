/*
// create posts
cron(once per day, () => {
  get posts to add from siteManager
  for each post
    getContent
    postContent
    trackAnalytics
})

// health check
cron(once per day, () => {
  get all sites from siteManager
  for each site
    fetch site
    trackAnalytics site status
})
*/
