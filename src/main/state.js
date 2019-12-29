const debug = (...args) => console.debug('State:', ...args) // eslint-disable-line

class State {
  constructor(object) {
    this.data = object
    this.listenerMap = {}
    Object.keys(object).forEach((key) => {
      this.listenerMap[key] = []
    })
  }

  get(key) {
    debug(`get ${key}`)
    return this.data[key]
  }

  set(key, value) {
    debug(`set ${key}`)
    this.data[key] = value
    this.listenerMap[key].forEach((listener, i) => {
      debug(`triggering listener ${i} of ${key}`)
      listener(value, this.data)
    })
  }

  subscribe(key, listener) {
    debug(`New subscriber for ${key}`)
    this.listenerMap[key].push(listener)
  }
}

global.state = new State({
  path: null,
  content: `graph TD
  A[Client] --> B[Load Balancer]
  B --> C[Server01]
  B --> D[Server02]`,
  svg: '',
  buffer: '', // Represents the last saved file
})

global.window = null
