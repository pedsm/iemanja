const loader = require('monaco-loader')
const { ipcRenderer } = require('electron')
const { injectMermaid } = require('../src/renderer/mermaid')
const { mermaidAPI } = require('mermaid')

const { debug, error } = console

const renderDiv = document.getElementById('renderer')

let state;

function handleChange(editor) {
  debug('Handle change start')
  const text = editor.getValue()
  state.content = text
  try {
    debug('Mermaid render start')
    debug(`Rendering \n ${text}`)
    const html = mermaidAPI.render('graph', text, (graph) => {
      state.svg = graph
      renderDiv.innerHTML = graph
    }, renderDiv)
    debug('Mermaid render end')
  } catch (err) {
    error(err)
  }
  debug('Handle change end')
}

let editor
async function main() {
  debug('Main render process started')
  state = require('electron').remote.getGlobal('state')
  const monaco = await loader()
  injectMermaid(monaco)
  editor = monaco.editor.create(document.getElementById('editor'), {
    theme: 'vs-dark',
    value: state.content,
    automaticLayout: true,
    language: 'mermaid'
  });

  handleChange(editor)
  editor.onKeyUp(e => handleChange(editor))
  debug('Main render process finished')
}

// Called by renderService
async function update() {
  debug('Update render started')
  editor.setValue(state.content)
  state = require('electron').remote.getGlobal('state')
  handleChange(editor)
  debug('Update render finished')
}

main()