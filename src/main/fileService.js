const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)
const { dialog } = require('electron')


const { debug, error } = console

async function saveFile(content) {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Diagram',
    filters: [{ name: 'Scalable Vector Graphics', extensions: ['svg'] }]
  })
  if (canceled) {
    debug('Save file canceled')
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
  saveFile
}