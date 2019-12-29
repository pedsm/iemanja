const { app, Menu } = require('electron')
const { saveFile } = require('./fileService')

const isMac = process.platform === 'darwin'

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' },
      {
        label: 'Export as SVG',
        accelerator: 'CmdOrCtrl+E',
        click() {
          saveFile(global.state.svg)
        } 
      }
    ]
  },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
]

const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)
