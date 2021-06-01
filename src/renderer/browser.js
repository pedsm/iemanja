const loader = require('monaco-loader')
const { ipcRenderer } = require('electron')
const { injectMermaid } = require('../src/renderer/mermaid')
const { notify, closeNotification } = require('../src/renderer/notification')
const { render } = require('../src/renderer/renderService')

const { error } = console
// eslint-disable-next-line
const debug = (...args) => console.debug('Browser:', ...args)

let state = {}

function setState(key, value) {
  ipcRenderer.send('mutateState', { key, value })
}

function handleChange(editor) {
  debug('Handle change start')
  const text = editor.getValue()
  setState('content', text)
  debug('Handle change end')
}

let editor
async function main() {
  debug('Monaco start')
  const monaco = await loader()
  injectMermaid(monaco)
  debug('Editor created')
  editor = monaco.editor.create(document.getElementById('editor'), {
    theme: 'vs',
    value: state.content,
    automaticLayout: true,
    language: 'mermaid',
  });
  editor.setValue('Loading...')

  editor.onKeyUp(() => handleChange(editor))
  debug('Monaco end')
  ipcRenderer.send('getState')
}

function updateState(event, newState) {
  debug('Receiving new state')
  state = newState
  try {
    render(state.content)
    closeNotification()
  } catch (err) {
    notify(err.message)
    error(err)
  }
  debug(state)
}

ipcRenderer.on('forceStateChange', (event, newState) => {
  debug('Force state update')
  editor.setValue(newState.content)
  updateState(event, newState)
})

ipcRenderer.on('updateState', updateState)

main()
