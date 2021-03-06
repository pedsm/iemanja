const { promisify } = require('util')
const { dialog } = require('electron')
const fs = require('fs')

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const { mermaidFilter, svgFilter } = require('../filters')
const { forceStateUpdate } = require('../state')

const { debug, error } = console

async function newFile() {
  try {
    global.state.set('path', null)
    global.state.set('content', 'graph TD \n\t A --> B')
    global.state.set('buffer', '')
    forceStateUpdate()
  } catch (err) {
    error(err)
  }
}

async function openFile() {
  // FIX this
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Open file',
      filters: [mermaidFilter],
    })
    if (canceled) {
      debug('Open file canceled')
    }
    const filePath = filePaths[0]
    global.state.set('path', filePath)
    const content = (await readFile(filePath)).toString()
    global.state.set('content', content)
    global.state.set('buffer', content)
    debug(`Read file ${filePath}`)
    forceStateUpdate()
  } catch (err) {
    error(err)
  }
}

async function saveToFile(path, content) {
  debug(`Saving file to ${path}`)
  try {
    await writeFile(path, content)
    debug(`File saved at ${path}`)
  } catch (e) {
    error(`Error saving file ${e}`)
  }
}

async function saveFile(path, content) {
  debug(`Current path is ${global.state.get('path')}`)
  if (path == null) {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Mermaid file',
      filters: [mermaidFilter],
    })
    if (canceled) {
      debug('Save file canceled')
      return
    }
    saveFile(filePath, content)
    return
  }
  global.state.set('buffer', content)
  global.state.set('path', path)
  debug(`Global path set to ${global.state.get('path')}`)
  saveToFile(path, content)
}

async function exportGraph(content) {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Diagram',
    filters: [svgFilter],
  })
  if (canceled) {
    debug('Export file canceled')
    return
  }
  saveToFile(filePath, content)
}

module.exports = {
  saveFile,
  exportGraph,
  openFile,
  newFile,
}
