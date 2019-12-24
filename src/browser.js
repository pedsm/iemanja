const loader = require('monaco-loader')
const { injectMermaid } = require('../src/mermaid')
const { mermaidAPI } = require('mermaid')

const renderDiv = document.getElementById('renderer')

const chart = `graph TD
    A[Client] --> B[Load Balancer]
    B --> C[Server01]
    B --> D[Server02]`

async function main() {
  const monaco = await loader()
  injectMermaid(monaco)
  const editor = monaco.editor.create(document.getElementById('editor'), {
    theme: 'vs-dark',
    value: chart,
    automaticLayout: true,
    language: 'mermaid'
  });

  editor.onKeyUp((e) => {
    const text = editor.getValue()
    try {
      const html = mermaidAPI.render('graph', text, (graph) => {
        renderDiv.innerHTML = graph
      }, renderDiv)
    } catch(err) {
      console.error(err)
    }

    // renderDiv.innerHTML = html
    // console.log(text)
  })
}


main()