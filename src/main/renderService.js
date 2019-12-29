const { debug, error } = console

function triggerRender() {
  try {
    debug('Triggering render')
    global.window.webContents.executeJavaScript('update()')
  } catch (e) {
    error(e)
  }
}

module.exports = {
  triggerRender,
}
