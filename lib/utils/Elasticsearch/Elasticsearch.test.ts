import Elasticsearch from './index'
import {termsAggs, topHitsAggs} from './fixtures'
const elasticsearch = Elasticsearch({index: 'index-test', url: 'http://example.com'})

test.skip('elasticsearch.add', async () => {
  await elasticsearch.add(
    {
      timestamp: new Date().toISOString(),
      prop11: 'prop11 value',
      prop2: 12345,
      prop3: [1, 2, 3, 4, 5],
      prop4: {a: 1, b: 2}
    }
  )
})

test.skip('elasticsearch.search', async () => {
  const documents = await elasticsearch.search(
    {query: {match: {prop11: 'prop11 value'}}}
  )
  console.log(documents)
})

test('elasticsearch._parseAggregations terms aggs', () => {
  const res = elasticsearch._parseAggregations(termsAggs)
  expect(res).toEqual({
    'kayleynolancuz@email.com': {
      random: {
        watch: 207,
        like: 144,
        dislike: 136,
        subscribe: 89,
        subscriptions: 1
      },
      'some video': {watch: 1, like: 2, dislike: 3, subscribe: 4, subscriptions: 5}
    },
    'figeroa3322@email.com': {random: {watch: 27, dislike: 11, like: 8, subscribe: 4}},
    'nobuckets@email.com': {}
  })
})

test('elasticsearch._parseAggregations top hits aggs', () => {
  const res = elasticsearch._parseAggregations(topHitsAggs)
  expect(res).toEqual({
    'kayleynolancuz@email.com': [
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-CA',
          city_name: 'Los Angeles',
          country_iso_code: 'US',
          region_name: 'California',
          location: {lon: -118.244, lat: 34.0544}
        },
        proxyProvider: 'proxystream',
        ip: '166.137.8.49',
        tags: [ 'analytics', 'routine' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'like',
        secondsWatched: 0,
        username: 'kayleynolancuz@email.com',
        timestamp: '2019-12-12T07:30:52.852Z'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-CA',
          city_name: 'Los Angeles',
          country_iso_code: 'US',
          region_name: 'California',
          location: {lon: -118.244, lat: 34.0544}
        },
        proxyProvider: 'proxystream',
        ip: '166.137.8.49',
        tags: [ 'analytics', 'routine' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'subscribe',
        secondsWatched: 103,
        username: 'kayleynolancuz@email.com',
        timestamp: '2019-12-12T06:53:38.134Z'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-CA',
          city_name: 'Los Angeles',
          country_iso_code: 'US',
          region_name: 'California',
          location: {lon: -118.244, lat: 34.0544}
        },
        proxyProvider: 'proxystream',
        ip: '166.137.8.49',
        tags: [ 'analytics', 'routine' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'subscribe',
        secondsWatched: 2,
        username: 'kayleynolancuz@email.com',
        timestamp: '2019-12-12T06:43:51.233Z'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-CA',
          city_name: 'Los Angeles',
          country_iso_code: 'US',
          region_name: 'California',
          location: {lon: -118.244, lat: 34.0544}
        },
        proxyProvider: 'proxystream',
        ip: '166.137.8.49',
        tags: [ 'analytics', 'routine' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'watch',
        secondsWatched: 106,
        username: 'kayleynolancuz@email.com',
        timestamp: '2019-12-12T06:39:18.586Z'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-CA',
          city_name: 'Los Angeles',
          country_iso_code: 'US',
          region_name: 'California',
          location: {lon: -118.244, lat: 34.0544}
        },
        proxyProvider: 'proxystream',
        ip: '166.137.8.49',
        tags: [ 'analytics', 'routine' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'watch',
        secondsWatched: 0,
        username: 'kayleynolancuz@email.com',
        timestamp: '2019-12-12T06:32:40.370Z'
      }
    ],
    'figeroa3322@email.com': [
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-SC',
          city_name: 'Columbia',
          country_iso_code: 'US',
          region_name: 'South Carolina',
          location: {lon: -80.863, lat: 34.1192}
        },
        ip: '2606:a000:1314:48b8:304b:f954:6d6f:431',
        tags: [ 'routine', 'analytics' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'watch',
        timestamp: '2019-11-14T00:15:43.640Z',
        username: 'figeroa3322@email.com'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-FL',
          city_name: 'Stuart',
          country_iso_code: 'US',
          region_name: 'Florida',
          location: {lon: -80.2587, lat: 27.0775}
        },
        ip: '50.248.33.33',
        tags: [ 'routine', 'analytics' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'watch',
        timestamp: '2019-11-03T16:19:22.941Z',
        username: 'figeroa3322@email.com'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-KS',
          city_name: 'Olathe',
          country_iso_code: 'US',
          region_name: 'Kansas',
          location: {lon: -94.7786, lat: 38.8518}
        },
        ip: '136.63.226.159',
        tags: [ 'routine', 'analytics' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'watch',
        timestamp: '2019-11-03T06:33:17.880Z',
        username: 'figeroa3322@email.com'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-KS',
          city_name: 'Olathe',
          country_iso_code: 'US',
          region_name: 'Kansas',
          location: {lon: -94.7786, lat: 38.8518}
        },
        ip: '136.63.226.159',
        tags: [ 'routine', 'analytics' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'like',
        timestamp: '2019-11-03T06:29:56.847Z',
        username: 'figeroa3322@email.com'
      },
      {
        geoip: {
          continent_name: 'North America',
          region_iso_code: 'US-TX',
          city_name: 'Odessa',
          country_iso_code: 'US',
          region_name: 'Texas',
          location: {lon: -102.341, lat: 31.8994}
        },
        ip: '174.126.182.252',
        tags: [ 'routine', 'analytics' ],
        accountStatus: 'GOOD',
        success: true,
        action: 'dislike',
        timestamp: '2019-11-02T23:06:30.001Z',
        username: 'figeroa3322@email.com'
      }
    ]
  })
})
