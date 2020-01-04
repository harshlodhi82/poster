const AGGREGATIONS = {
  'filtered_usernames': {
    'doc_count': 761,
    'success_actions': {
      'doc_count': 627,
      'usernames': {
        'doc_count_error_upper_bound': 0,
        'sum_other_doc_count': 0,
        'buckets': [
          {
            'key': 'kayleynolancuz@email.com',
            'doc_count': 577,
            'videos': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'random',
                  'doc_count': 577,
                  'actions': {
                    'doc_count_error_upper_bound': 0,
                    'sum_other_doc_count': 0,
                    'buckets': [
                      {
                        'key': 'watch',
                        'doc_count': 207
                      },
                      {
                        'key': 'like',
                        'doc_count': 144
                      },
                      {
                        'key': 'dislike',
                        'doc_count': 136
                      },
                      {
                        'key': 'subscribe',
                        'doc_count': 89
                      },
                      {
                        'key': 'subscriptions',
                        'doc_count': 1
                      }
                    ]
                  }
                },
                {
                  'key': 'some video',
                  'doc_count': 577,
                  'actions': {
                    'doc_count_error_upper_bound': 0,
                    'sum_other_doc_count': 0,
                    'buckets': [
                      {
                        'key': 'watch',
                        'doc_count': 1
                      },
                      {
                        'key': 'like',
                        'doc_count': 2
                      },
                      {
                        'key': 'dislike',
                        'doc_count': 3
                      },
                      {
                        'key': 'subscribe',
                        'doc_count': 4
                      },
                      {
                        'key': 'subscriptions',
                        'doc_count': 5
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            'key': 'figeroa3322@email.com',
            'doc_count': 50,
            'videos': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'random',
                  'doc_count': 50,
                  'actions': {
                    'doc_count_error_upper_bound': 0,
                    'sum_other_doc_count': 0,
                    'buckets': [
                      {
                        'key': 'watch',
                        'doc_count': 27
                      },
                      {
                        'key': 'dislike',
                        'doc_count': 11
                      },
                      {
                        'key': 'like',
                        'doc_count': 8
                      },
                      {
                        'key': 'subscribe',
                        'doc_count': 4
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            'key': 'nobuckets@email.com',
            'doc_count': 50,
            'videos': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': []
            }
          }
        ]
      }
    }
  }
}

export default {AGGREGATIONS}
