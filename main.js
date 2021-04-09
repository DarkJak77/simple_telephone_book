const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')


ipcMain.on('toMain',  (event, ...args) => {
  let options = {
    type: 'info',
    title: 'Rubrica',
    message: args[0],
  };

  if (args[0] == 'no_data') {
    options.message = 'Operazione non consentita.'
    options.type = 'error'
  }
  dialog.showMessageBox(null, options)
})

function createWindow() {

  // Dev 1 == Activate
  let dev = 0
  let option = {
    title: 'Rubrica',
    width: 800,
    height: 600,
    center: true,
    resizable: false,
    fullscreenable: false,
    icon: "./src/ico/police.ico",

    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  }

  
  if (dev == 1) {
    option.resizable = true
    option.fullscreenable = true
  } else {
  }

  const win = new BrowserWindow(option)

  win.setMenu(null)
  dialog.showMessageBox(null, {type: 'info',title: 'Rubrica',message : 'Buona Giornata!'})

  if (dev == 1) {
    win.webContents.openDevTools();
  }
  
  win.loadFile('./home/home.html')

 

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

