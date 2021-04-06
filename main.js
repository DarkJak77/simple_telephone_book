const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

ipcMain.on('toMain',  (event, ...args) => {
  let options = {
    type: 'info',
    title: 'Piccolo Matricolista',
    message: args[0],
  };

  if (args[0] == 'no_data') {
    options.message = 'Operazione non consentita.\nNessuno parametro inserito'
    options.type = 'error'
  }
  dialog.showMessageBox(null, options)
})

function createWindow() {
  const win = new BrowserWindow({
    title: 'Piccolo Matricolista',
    width: 800,
    height: 600,
    center: true,
    resizable: false,
    fullscreenable: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  win.setMenu(null)
  //win.webContents.openDevTools();
  
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

