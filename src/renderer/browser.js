const loader = require('monaco-loader')
const { mermaidAPI } = require('mermaid')
const { getGlobal } = require('electron').remote
const { injectMermaid } = require('../src/renderer/mermaid')
const { notify, closeNotification } = require('../src/renderer/notification')

const { debug, error } = console
const renderDiv = document.getElementById('renderer')

let state;

function handleChange(editor) {
  debug('Handle change start')
  const text = editor.getValue()
  state.set('content', text)
  try {
    debug('Mermaid render start')
    debug(`Rendering \n ${text}`)
    mermaidAPI.render('graph', text, (graph) => {
      state.set('svg', graph)
      renderDiv.innerHTML = graph
    }, renderDiv)
    closeNotification()
    debug('Mermaid render end')
  } catch (err) {
    notify(err.message)
    error(err)
  }
  debug('Handle change end')
}

let editor
async function main() {
  debug('Main render process started')
  state = getGlobal('state')
  const monaco = await loader()
  injectMermaid(monaco)
  editor = monaco.editor.create(document.getElementById('editor'), {
    theme: 'vs',
    value: state.get('content'),
    automaticLayout: true,
    language: 'mermaid',
  });

  handleChange(editor)
  editor.onKeyUp(() => handleChange(editor))
  debug('Main render process finished')
}

// Called by renderService
// eslint-disable-next-line
async function update() {
  debug('Update render started')
  editor.setValue(state.get('content'))
  state = getGlobal('state')
  handleChange(editor)
  debug('Update render finished')
}

main()
