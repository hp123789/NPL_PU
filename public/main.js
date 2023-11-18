const { app, BrowserWindow, ipcMain } = require('electron')
const remote = require('electron')
const {screen} = remote
const redis = require('redis')
var ks = require('node-key-sender')
require('dotenv').config();

const client = redis.createClient()
const stream_name = "stream2"

let leftSide = true
let isCollapsed = true

async function startRedisClient() {
  client.on('error', err => console.log('Redis Client Error', err))
  await client.connect()
}

async function redisGet() {
  const value = await client.get('output_stream');
  console.log(value)
  return value
}

async function redisXread() {
  while (true) {
    let response = await client.xRead(
      redis.commandOptions({
        isolated: true
      }), [
        {
          key: stream_name,
          id: '0-0'
        }
      ], {
        COUNT: 1,
        BLOCK: 5000
      }
    )
    let currentId = response[0].messages[0]
    console.log(JSON.stringify(currentId))
  }
}

async function redisXrevrange() {
    let response = await client.xRevRange(stream_name, '+', '-', 'COUNT', '1', function(err, Data) {})
    response = response[0].message['word']
    response = JSON.stringify(response).replace(/^"(.*)"$/, '$1')
    return response
  }

async function redisXadd() {
  client.xAdd(stream_name, "*", "state", "speech", "word", "word1")
}

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowHeight = parseInt(0.8*height)
  const windowWidth = parseInt(0.1*width)
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
    x: parseInt(0.1*windowWidth),
    y: parseInt((height-windowHeight)/2),
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "\\preload.js"
    }
  })

  ipcMain.on('set-side', () => {
    if (leftSide) {
      win.setPosition((width - parseInt(0.1*windowWidth) - windowWidth), parseInt((height-windowHeight)/2), true)
      leftSide = !leftSide
    }
    else {
      win.setPosition(parseInt(0.1*windowWidth), parseInt((height-windowHeight)/2), true)
      leftSide = !leftSide
    }
  })

  ipcMain.on('collapse-menu', () => {
    if (isCollapsed) {
      win.setMinimumSize(windowWidth,windowWidth,true)
      win.setSize(windowWidth,windowWidth,true)
      isCollapsed = !isCollapsed
    }
    else {
      win.setMinimumSize(windowWidth,windowHeight,true)
      win.setSize(windowWidth,windowHeight,true)
      isCollapsed = !isCollapsed
    }
  })

  ipcMain.on('back-space', () => {
    setTimeout(function() {
      ks.sendCombination(["alt","tab"])
      setTimeout(function() {
        ks.sendCombination(['control','back_space'])
      }, 100)
    }, 10)
  })

  win.loadURL('http://localhost:3000');

  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  // startRedisClient()
  // redisXrevrange()
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