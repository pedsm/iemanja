const loader = require('monaco-loader')
const { injectMermaid } = require('../src/renderer/mermaid')
const { mermaidAPI } = require('mermaid')
const state = require('electron').remote.getGlobal('state')
const { saveFile } = require('electron').remote.require('../main/fileService')

const renderDiv = document.getElementById('renderer')

function handleChange(editor) {
  const text = editor.getValue()
  state.content = text
  try {
    const html = mermaidAPI.render('graph', text, (graph) => {
      state.svg = graph
      renderDiv.innerHTML = graph
    }, renderDiv)
  } catch (err) {
    console.error(err)
  }
}

async function main() {
  const monaco = await loader()
  injectMermaid(monaco)
  const editor = monaco.editor.create(document.getElementById('editor'), {
    theme: 'vs-dark',
    value: state.content,
    automaticLayout: true,
    language: 'mermaid'
  });

  handleChange( editor)
  editor.onKeyUp(e => handleChange(editor))
}


main()