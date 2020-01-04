import log from 'lib/utils/logger'
import autoBind from 'auto-bind'

class Countdown {
  constructor () {
    this.nextCountdownId = 1
    this.countdowns = []
    autoBind(this)
    this.start()
  }

  countdown (ms, countdownName) {
    if (typeof ms !== 'number') {
      throw Error(`countdown ms ${ms} is not a number`)
    }
    countdownName = countdownName || getCallerName()
    const countdown = this.createCountdown(ms, countdownName)
    this.countdowns.push(countdown)
    return countdown
  }

  createCountdown (ms, countdownName) {
    const countdown = {}
    countdown.id = this.getNextCountdownId()
    countdown.name = countdownName || `countdown ${countdown.id}`
    countdown.secondsRemaining = getSeconds(ms)
    const interval = setInterval(() => {
      if (countdown.secondsRemaining-- <= 0) {
        clearInterval(interval)
      }
    }, 1000).unref()
    countdown.end = () => {
      countdown.secondsRemaining = 0
    }
    return countdown
  }

  start () {
    this.displayCountdowns()
    setInterval(() => this.displayCountdowns(), 1000).unref()
  }

  displayCountdowns () {
    let countdownString = ''
    for (const [i, countdown] of this.countdowns.entries()) {
      if (countdown.secondsRemaining > 0) {
        countdownString += `(${countdown.name}) ${countdown.secondsRemaining} `
      }
      else {
        this.countdowns.splice(i, 1)
      }
    }

    if (countdownString !== '') {
      process.stdout.write(' ' + countdownString + '\r')
    }
  }

  getNextCountdownId () {
    return this.nextCountdownId++
  }
}

const getSeconds = (ms) => Math.ceil(ms / 1000)
const getCallerName = () => {
  try {
    const callerName = new Error().stack.split('\n')[3].split(/ +/)[2]
    return callerName
  }
  catch (e) {
    log.info(e.message)
    log.info(`couldn't get countdown caller name`)
  }
}

export default new Countdown().countdown
