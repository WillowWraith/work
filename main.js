const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu } = require('electron')

let mainWindow = null
let tray = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadFile('index.html')

  tray = new Tray('pet.png')
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '显示/隐藏宠物', 
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide()
        } else {
          mainWindow.show()
        }
      } 
    },
    { type: 'separator' },
    { 
      label: '退出程序', 
      click: () => {
        app.quit()
      } 
    }
  ])

  tray.setToolTip('我的桌面宠物')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.setIgnoreMouseEvents(ignore, options)
})

app.whenReady().then(() => {
  createWindow()

  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})