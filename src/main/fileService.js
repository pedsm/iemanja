const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)
const { dialog } = require('electron')

const { debug, error } = console

async function saveFile(path, content) {
  debug(`Current path is ${global.state.path}`)
  if(path == null) {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Diagram',
      filters: [{ name: 'Mermaid chart', extensions: ['mmd'] }]
    })
    if(canceled) {
      return debug('Save file canceled')
    }
    return await saveFile(filePath, content)
  }
  global.state.path = path
  debug(`Global path set to ${global.state.path}`)
  return await saveToFile(path, content)
}

async function exportGraph(content) {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Diagram',
    filters: [{ name: 'Scalable Vector Graphics', extensions: ['svg'] }]
  })
  if (canceled) {
    debug('Export file canceled')
    return
  }
  return await saveToFile(filePath, content)

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

module.exports = {
  saveFile,
  exportGraph
}