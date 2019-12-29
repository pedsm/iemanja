const { app, Menu } = require('electron')
const { 
  saveFile,
  openFile,
  exportGraph 
} = require('./fileService')

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
        label: 'Open file',
        accelerator: 'CmdOrCtrl+O',
        click() {
          openFile()
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click() {
          saveFile(global.state.path, global.state.content)
        } 
      },
      {
        label: 'Save as...',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() {
          saveFile(null, global.state.content)
        } 
      },
      {
        label: 'Export as SVG',
        accelerator: 'CmdOrCtrl+E',
        click() {
          exportGraph(global.state.svg)
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
