require('./state') // State
require('./services/titleService') // Title
require('./menu') // Menu
const { app, BrowserWindow } = require('electron')
const { join } = require('path')

function createWindow() {
  // Create the browser window.
  global.window = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  global.window.loadFile(join('./views/index.html'))

  const isDev = process.argv.map((arg) => arg === '--dev' || arg === '-d').reduce((a, b) => a || b)
  if (isDev) {
    global.window.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  global.window.on('closed', () => {
    global.window = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (global.window === null) {
    createWindow()
  }
})
