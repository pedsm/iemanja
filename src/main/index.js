require('./state') // State
require('./menu') // Menu
const {app, BrowserWindow} = require('electron')
const { join } = require('path')


let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  mainWindow.loadFile(join('./views/index.html'))

  const isDev = process.argv.map(arg => arg === '--dev' || arg === '-d').reduce((a, b) => a || b)
  if(isDev) {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
