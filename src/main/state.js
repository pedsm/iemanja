const { ipcMain } = require('electron')

const debug = (...args) => console.debug('State:', ...args) // eslint-disable-line

function forceStateUpdate() {
  global.window.webContents.send('forceStateChange', global.state.data);
}
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
    if (this.data[key] === value) {
      debug('Early return')
      return // Stop if there is no change
    }
    debug(`set ${key}`)
    this.data[key] = value
    this.listenerMap[key].forEach((listener, i) => {
      debug(`triggering listener ${i} of ${key}`)
      listener(value, this.data)
    })
    if (key !== 'svg') { // Svg updates is a single time update
      global.window.webContents.send('updateState', this.data);
    }
  }

  subscribe(key, listener) {
    debug(`New subscriber for ${key}`)
    this.listenerMap[key].push(listener)
  }
}

const state = new State({
  path: null,
  content: `graph TD
  A[Client] --> B[Load Balancer]
  B --> C[Server01]
  B --> D[Server02]`,
  svg: '',
  buffer: '', // Represents the last saved file
})

ipcMain.on('mutateState', (event, { key, value }) => {
  debug('Receiving event mutation')
  if (key) {
    state.set(key, value)
  }
})

ipcMain.on('getState', (event) => {
  event.reply('forceStateChange', state.data)
})

global.state = state

module.exports = {
  forceStateUpdate,
}
