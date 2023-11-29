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
const path = require('path')
const {keyboard, Key, getActiveWindow} = require("@nut-tree/nut-js")
const Keyboard = require('input-event/lib/keyboard')


const client = redis.createClient()
const stream_name = "stream2"

let leftSide = true
let isCollapsed = true
let paused = false
let done = false
let speech = false
let sentence = ""
let s = ""
let devicePort = ""
let foundPort = false

async function helpme() {
  console.log('test')
  return "hello"
}

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

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
    minimizable: false,
    maximizable: false,
    closable: false,
    // titleBarStyle: 'hidden',
    x: parseInt(0.05*windowWidth),
    y: parseInt((height-windowHeight)-(windowHeight*0.1)),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-side', () => {
    if (leftSide) {
      win.setPosition(parseInt(0.05*windowWidth), parseInt((windowHeight-height)+(windowHeight*0.1)), true)
      leftSide = !leftSide
    }
    else {
      win.setPosition(parseInt(0.05*windowWidth), parseInt((height-windowHeight)-(windowHeight*0.1)), true)
      leftSide = !leftSide
    }
  })

  ipcMain.on('collapse-menu', () => {
    if (isCollapsed) {
      win.setMinimumSize(windowHeight,windowHeight,true)
      win.setMaximumSize(windowHeight,windowHeight,true)
      win.setSize(windowHeight,windowHeight,true)
      if (!leftSide) {
        // win.setPosition((parseInt(width-(0.05*windowWidth)-windowHeight)), parseInt((windowHeight-height)+(windowHeight*0.1)), true)
      }
      isCollapsed = !isCollapsed
    }
    else {
      win.setMinimumSize(windowWidth,windowHeight,true)
      win.setMaximumSize(windowWidth,windowHeight,true)
      win.setSize(windowWidth,windowHeight,true)
      if (!leftSide) {
        // win.setPosition((parseInt(width-(0.05*windowWidth)-windowHeight)), parseInt((windowHeight-height)+(windowHeight*0.1)), true)
      }
      isCollapsed = !isCollapsed
    }
  })

  ipcMain.on('back-space', () => {
    if (speech) {
      setTimeout(function() {
        deleteWord()
      }, 100)
    } else {
      setTimeout(function() {
        tabDelete()
      }, 10)
    }
  })

  ipcMain.on('pause-button', () => {
    paused = !paused
    // if (paused) {
    //   win.setMaximumSize(width, height)
    // } else {
    //   win.setMaximumSize(windowWidth, windowHeight)
    // }
    // win.setFullScreen(paused)
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
    tabOut()
  })

  ipcMain.on('redo-button', () => {
    win.show()
    done = false
    tabOut()
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
    // titleBarStyle: 'hidden',
    x: parseInt((0.5*width)-(0.5*windowWidth)),
    y: parseInt((height-windowHeight)-(windowHeight*1.2)),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
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
      tabOut()
    }
  })

  ipcMain.on('text-mode', () => {
    win2.hide()
    speech = false
  })

  ipcMain.on('help', () => {
    console.log('help')
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
    minimizable: false,
    maximizable: false,
    closable: false,
    // titleBarStyle: 'hidden',
    x: parseInt((0.5*width)-(0.5*windowWidth)),
    y: parseInt((height-windowHeight)-(windowHeight*0.2)),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
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
    playSound(sentence)
    win3.hide()
    done = false
  })

  ipcMain.on('redo-button', () => {
    win3.hide()
    done = false
  })

  win3.loadFile(__dirname + "\\play.html");
}

app.whenReady().then(() => {
  // startRedisClient()
  // redisXrevrange()
  // readSerial()
  findDevicePort()
  checkFlag()
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

  // let devicePort = "/dev/tty.usbserial-120"

  // SerialPort.list().then(function(ports){
  //   ports.forEach(function(port){
  //     if (port['vendorId']) {
  //       if (port['vendorId'] == "1a86") {
  //         let devicePort = port['path']
  //         console.log(devicePort)
  //         return devicePort
  //       }
  //     }
  //   })
  // });
  
  const port = new SerialPort({ path: devicePort, baudRate: 115200 })

  const parser = new ReadlineParser({delimiter: '\n'})
  port.pipe(parser)

  let p_dat = ""
  parser.on("data", (line) => {
    let dat = line
    if (dat != p_dat) {
      console.log(dat)
      p_dat = dat
      // let data = String(dat.slice(0, -1))
      let data = dat
      data = data.split(',')
      console.log(data)
      let word = data[0] + " "
      // let word = data[0].split('')
      // word.push("space")
      sentence = data[1]
      if (!paused && !speech) {
        typeWord(word)
      }
      else if (!paused && speech && !done) {
        // ipcMain.handle('speech-text', pleaseHelp)
        // remote.webContents.send('async-message', 'help')
        sendMessage(sentence)
      }
    }
  })

}

async function tabDelete() {
  await keyboard.pressKey(Key.LeftSuper, Key.Tab)
  await keyboard.releaseKey(Key.LeftSuper, Key.Tab)
  await keyboard.pressKey(Key.LeftAlt, Key.Backspace)
  await keyboard.releaseKey(Key.LeftAlt, Key.Backspace)
}

async function deleteWord() {
  await keyboard.pressKey(Key.LeftControl, Key.Backspace)
  await keyboard.releaseKey(Key.LeftControl, Key.Backspace)
}

async function tabOut() {
  await keyboard.pressKey(Key.LeftSuper, Key.Tab)
  await keyboard.releaseKey(Key.LeftSuper, Key.Tab)
}

async function typeWord(w) {
  await keyboard.type(String(w))
}

async function playSound(input) {
  var gtts = new gTTS(input, 'en');
  setTimeout(function() {
    gtts.save('/tmp/hello.mp3', function (err, result) {
      if(err) { throw new Error(err) }
      console.log('Success! Open file /tmp/hello.mp3 to hear result.');
    });
  },500)
  sound.play('/tmp/hello.mp3')
}

async function sendMessage(message) {
    if (s != sentence) {
      console.log('sending')
      const activeWindow = BrowserWindow.getFocusedWindow()
      activeWindow.webContents.send("message", message)
      s = sentence
  }
}

async function findDevicePort() {
  SerialPort.list().then(function(ports){
    ports.forEach(function(port){
      if (port['vendorId']) {
        if (port['vendorId'] == "1a86") {
          devicePort = port['path']
          console.log(devicePort)
          foundPort = true
          // return devicePort
        }
      }
    })
  });
}

function checkFlag() {
  if(foundPort === false) {
     setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
  } else {
    /* do something*/
    readSerial()
  }
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