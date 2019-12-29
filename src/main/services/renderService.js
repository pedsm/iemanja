const { debug, error } = console

function triggerRender() {
  try {
    debug('Triggering render')
    global.window.webContents.executeJavaScript('update()')
  } catch (e) {
    error(e)
  }
}

function setTitle(fileName) {
  debug('Changing screen title')
  // TODO is this vulnerable to JS injection? probably
  global.window.webContents.executeJavaScript(`setTitle('${fileName}')`)
}

module.exports = {
  triggerRender,
  setTitle,
}
