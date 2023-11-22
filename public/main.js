const { app, BrowserWindow, ipcMain } = require('electron')
const remote = require('electron')
const {screen} = remote
const redis = require('redis')
var ks = require('node-key-sender')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { elementIsDisabled } = require('selenium-webdriver/lib/until')
require('dotenv').config()
const sound = require('sound-play')
const gTTS = require('gtts')


const client = redis.createClient()
const stream_name = "stream2"

let leftSide = true
let isCollapsed = true
let paused = false
let done = false
let speech = false

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowHeight = parseInt(0.1*height)
  const windowWidth = parseInt(0.5*width)
  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maxWidth: windowWidth, minWidth: windowWidth,
    maxHeight: windowHeight, minHeight: windowHeight,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    titleBarStyle: 'hidden',
    x: parseInt(0.05*windowWidth),
    y: parseInt((height-windowHeight)-(windowHeight*0.2)),
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "\\preload.js"
    }
  })

  ipcMain.on('set-side', () => {
    if (leftSide) {
      win.setPosition((width - parseInt(0.05*windowWidth) - windowWidth), parseInt((height-windowHeight)-(windowHeight*0.2)), true)
      leftSide = !leftSide
    }
    else {
      win.setPosition(parseInt(0.05*windowWidth), parseInt((height-windowHeight)-(windowHeight*0.2)), true)
      leftSide = !leftSide
    }
  })

  ipcMain.on('collapse-menu', () => {
    if (isCollapsed) {
      win.setMinimumSize(windowHeight,windowHeight,true)
      win.setMaximumSize(windowHeight,windowHeight,true)
      win.setSize(windowHeight,windowHeight,true)
      if (!leftSide) {
        win.setPosition((parseInt(width-(0.05*windowWidth)-windowHeight)), parseInt((height-windowHeight)-(windowHeight*0.2)), true)
      }
      isCollapsed = !isCollapsed
    }
    else {
      win.setMinimumSize(windowWidth,windowHeight,true)
      win.setMaximumSize(windowWidth,windowHeight,true)
      win.setSize(windowWidth,windowHeight,true)
      if (!leftSide) {
        win.setPosition((width - parseInt(0.05*windowWidth) - windowWidth), parseInt((height-windowHeight)-(windowHeight*0.2)), true)
      }
      isCollapsed = !isCollapsed
    }
  })

  ipcMain.on('back-space', () => {
    if (speech) {
      setTimeout(function() {
        ks.sendCombination(['control','back_space'])
      }, 100)
    } else {
      setTimeout(function() {
        ks.sendCombination(["alt","tab"])
        setTimeout(function() {
          ks.sendCombination(['control','back_space'])
        }, 100)
      }, 10)
    }
  })

  ipcMain.on('pause-button', () => {
    paused = !paused
    if (paused) {
      win.setMaximumSize(width, height)
    } else {
      win.setMaximumSize(windowWidth, windowHeight)
    }
    win.setFullScreen(paused)
  })

  ipcMain.on('speech-mode', () => {
    createNewWindow()
    speech = true
  })

  ipcMain.on('done-button', () => {
    done = true
    win.hide()
    playWindow()
  })

  ipcMain.on('play-button', () => {
    win.show()
    done = false
    ks.sendCombination(["alt","tab"])
  })

  win.loadURL('http://localhost:3000');

  // win.webContents.openDevTools()
}

function createNewWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowHeight = parseInt(0.1*height)
  const windowWidth = parseInt(0.5*width)
  let win2 = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maxWidth: windowWidth, minWidth: windowWidth,
    maxHeight: windowHeight, minHeight: windowHeight,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    titleBarStyle: 'hidden',
    x: parseInt((0.5*width)-(0.5*windowWidth)),
    y: parseInt((height-windowHeight)-(windowHeight*1.2)),
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "\\preload.js",
      contextIsolation: false
    }
  })

  win2.on('close', () => {
    win2 = null;
  });

    // set to null
  win2.on('closed', () => {
    win2 = null;
  });

  win2.on('blur', () => {
    if (!done) {
      ks.sendCombination(["alt","tab"])
    }
  })

  ipcMain.on('text-mode', () => {
    win2.hide()
    speech = false
  })

  win2.loadFile(__dirname + "\\caption.html");
}

function playWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowHeight = parseInt(0.1*height)
  const windowWidth = parseInt(0.3*width)
  let win3 = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maxWidth: windowWidth, minWidth: windowWidth,
    maxHeight: windowHeight, minHeight: windowHeight,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    titleBarStyle: 'hidden',
    x: parseInt((0.5*width)-(0.5*windowWidth)),
    y: parseInt((height-windowHeight)-(windowHeight*0.2)),
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "\\preload.js"
    }
  })

  win3.on('close', () => {
    win3 = null;
  });

    // set to null
  win3.on('closed', () => {
    win3 = null;
  });

  ipcMain.on('text-mode', () => {
    win3.hide()
  })

  ipcMain.on('play-button', () => {
    win3.hide()
    done = false
  })

  win3.loadFile(__dirname + "\\play.html");
}

app.whenReady().then(() => {
  // startRedisClient()
  // redisXrevrange()
  readSerial()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

async function readSerial() {
  const port = new SerialPort({ path: 'COM3', baudRate: 115200 })

  port.on("open", function() {
    console.log("-- Connection opened --");
    port.on("data", function(data) {
      data = String(data.slice(0, -1))
      data = data.split('')
      ks.sendKeys(data)
      ks.sendKey("space")
      console.log(data);
    });
  })
}

// async function startRedisClient() {
//   client.on('error', err => console.log('Redis Client Error', err))
//   await client.connect()
// }

// async function redisGet() {
//   const value = await client.get('output_stream');
//   console.log(value)
//   return value
// }
// 
// async function redisXread() {
//   while (true) {
//     let response = await client.xRead(
//       redis.commandOptions({
//         isolated: true
//       }), [
//         {
//           key: stream_name,
//           id: '0-0'
//         }
//       ], {
//         COUNT: 1,
//         BLOCK: 5000
//       }
//     )
//     let currentId = response[0].messages[0]
//     console.log(JSON.stringify(currentId))
//   }
// }

// async function redisXrevrange() {
//     let response = await client.xRevRange(stream_name, '+', '-', 'COUNT', '1', function(err, Data) {})
//     response = response[0].message['word']
//     response = JSON.stringify(response).replace(/^"(.*)"$/, '$1')
//     return response
//   }

// async function redisXadd() {
//   client.xAdd(stream_name, "*", "state", "speech", "word", "word1")
// }