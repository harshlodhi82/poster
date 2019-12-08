const log = require('lib/utils/logger')
const autoBind = require('auto-bind')

class LibExample {
  constructor ({someDependency} = {}) {
    log.info('lib example created!')
    this.someDependency = someDependency
    autoBind(this)
  }

  getSomeDependency () {
    log.info('here is some dependency')
    return this.someDependency
  }
}

module.exports = (...args) => new LibExample(...args)

/*

if module is singleton:

module.exports = new LibExample()

if module is function:

const libExample = new LibExample()
module.exports = libExample.getSomeDependency

*/
