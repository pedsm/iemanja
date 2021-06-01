const { mermaidAPI } = require('mermaid')
const { ipcRenderer } = require('electron')

const debug = (...args) => console.debug('Render:', ...args) // eslint-disable-line
const { time, timeEnd } = console
const renderDiv = document.getElementById('renderer')

mermaidAPI.initialize({
  flowChart: {
    useMaxWidth: false,
  },
})

function setState(key, value) {
  ipcRenderer.send('mutateState', { key, value })
}

function render(text) {
  debug('Starting render')
  time('render')
  mermaidAPI.render('graph', text, (graph) => {
    renderDiv.innerHTML = graph
    setState('svg', graph)
    timeEnd('render')
  }, renderDiv)
  debug('Render complete')
}

module.exports = {
  render,
}
