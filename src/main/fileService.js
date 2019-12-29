const { promisify } = require('util')
const { dialog } = require('electron')
const fs = require('fs')

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const { mermaidFilter, svgFilter } = require('./filters')
const { triggerRender } = require('./renderService')

const { debug, error } = console

async function openFile() {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Open file',
      filters: [mermaidFilter],
    })
    if (canceled) {
      debug('Open file canceled')
    }
    const filePath = filePaths[0]
    global.state.path = filePath
    const content = await readFile(filePath)
    global.state.content = content.toString()
    debug(`Read file ${filePath}`)
    triggerRender('New file opened')
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
  debug(`Current path is ${global.state.path}`)
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
  global.state.path = path
  debug(`Global path set to ${global.state.path}`)
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
}
