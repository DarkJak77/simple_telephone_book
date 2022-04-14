const { app, BrowserWindow, ipcMain, dialog, session, } = require('electron')
const path = require('path')

let dev = 0
let main_page = ''

// Is used to receive command from "master.js"
// For now this function is used olny for make dialog
ipcMain.on('toMain', (event, ...args) => {
  let options = {
    type: 'info',
    title: 'Rubrica',
    message: args[0],
  };

  // When "master.js" send "no_data" text's, change type dialog to error
  if (args[0] == 'no_data') {
    options.message = 'Operazione non consentita.'
    options.type = 'error'

    dialog.showMessageBox(null, options)

  } else  {
    dialog.showMessageBox(null, options)

  }

})


class createWindow {

  constructor(mode = 'slave') {
    this.mode = mode
    this.close = false

    if (this.mode == 'master') {

      this.win = new BrowserWindow({
        title: 'Rubrica',
        width: 800,
        height: 600,
        center: true,
        resizable: false,
        fullscreenable: false,
        icon: __dirname + "\\src\\ico\\police.ico",

        webPreferences: {
          preload: path.join(__dirname, '/src/js/preload/preload.js')
        }
      })

      this.win.setPosition(0, 0)


      if (dev == 1) {
        this.win.resizable = true,
          this.win.fullscreenable = true
        //win.webContents.openDevTools();

      } else {
        // Disable the Menu
        this.win.setMenu(null)

      }

      this.win.loadFile('./home/home.html')

    } else if (this.mode == 'slave') {

      this.win = new BrowserWindow({
        width: 800,
        height: 800,
        maximizable: true,
        show: false,


        webPreferences: {
          preload: path.join(__dirname, '/src/js/preload/preload_slave.js')
        }

      })
      this.win.setPosition(0, 0)

    }

    /*
    this.win.on('close', (event) => {

      this.confirmAndQuit(event)

    })
    */
    

  }

  // Evita la chiusura dell'app se ci sono download in corso
  confirmAndQuit(e) {

    if (this.close == false) {
      e.preventDefault();
    }

    // dialog options
    const messageBoxOptions = {

      title: 'Rubrica',
      type: 'info',
      buttons: ['Esci', 'Aspetta'],
      defaultId: 0,
      message: 'Sei sicuro di voler uscire?'

    };

    if (this.mode == 'slave') {
      this.hide()
    } else {
      //show the dialog
      dialog.showMessageBox(this.win, messageBoxOptions)
        .then(result => {
          if (result.response == 0) {
            // to delete data session 
            session.defaultSession.clearStorageData((data) => { })

            this.close = true
            app.quit()

          }
        })
    }

  }

  destroy() {
    this.win.destroy();

  }

  // serve per mandare messaggi dalla finestra principale alle secondarie
  send(msg) {
    this.win.webContents.send('myRenderChannel', msg)
  }

  // usata per il menù delle opzioni
  dialog(option) {
    dialog.showMessageBox(this.win, option)
      .then(result => {
        if (result.response === 0) {

        } else if (result.response === 1) {
          shell.openExternal('https://github.com/DarkJak77/mangaworld_manager')
        }
      }
      )
  }

  // usata per creare una barra per gli incarichi ( SPERIMENTALE )
  progress(value, max_value) {
    this.win.setProgressBar(
      ((value * 100) / max_value) / 100
    )
  }

  // usata per rimuovere la barra di progressione
  no_bar() {
    this.win.setProgressBar(0)
  }

  // riporta il titolo a quello originale
  title_default() {
    this.win.setTitle('WIP')
  }

  // cambia il titolo in base al numero di download rimanenti
  title_download() {
    this.win.setTitle('WIP')
  }

  // imposta un titolo personalizzato
  title(text) {
    this.win.setTitle('WIP - ' + text)
  }

  check_page() {
    return this.win.webContents.getURL()
  }

  goto(link) {
    this.win.loadURL(link)
  }

  delete_cookies(src) {
    session.defaultSession.clearStorageData((data) => { })
    if (fs.existsSync(path.join(__dirname, src))) {
      fs.unlinkSync(path.join(__dirname, src))
    }
  }

  async load_coockie(src) {
    this.src = src
    this.src_path = path.join(__dirname, this.src)
    if (fs.existsSync(this.src_path)) {

      if (fs.readFileSync(this.src_path, { encoding: 'utf8', flag: 'r' }) != '[]') {
        this.cookiesString = await fs.promises.readFile(this.src_path);
        this.cookies = JSON.parse(this.cookiesString);
        this.cookies.map((cookie) => session.defaultSession.cookies.set(cookie)
          .then(
            () => { }
          )
          .catch(
            (e) => console.log(e)
          )
        )

      }
    }
  }

  saveCookie() {
    this.url = this.check_page()
    session.defaultSession.cookies.get({})
      .then((cookies) => {
        if (cookies != []) {
          this.to_insert = cookies.map(
            (value) => {
              value.url = this.url
              return value
            }
          )
          fs.writeFileSync(path.join(__dirname, '/src/cookies/cookies.json'), JSON.stringify(this.to_insert, null, 2));
        }
      }).catch((error) => {
        console.log(error)
      })
  }

  eval(code) {
    this.win.webContents.executeJavaScript(code)
  }

  show() {
    this.win.show()
  }

  hide() {
    this.win.hide()
  }

  emulation() {
    this.win.webContents.enableDeviceEmulation({
      screenPosition: 'desktop',
      screenSize: { width: 1000, height: 1000 },
      viewSize: { width: 1000, height: 1000 },
      fitToView: true,
      deviceScaleFactor: 1,
    })
  }

  page_down() {
    this.win.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'PageDown' })
  }

}


app.whenReady().then(() => {
  main_page = new createWindow('master')
  main_page

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      main_page = new createWindow('master')
      main_page
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

