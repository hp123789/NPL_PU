const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setSide: () => ipcRenderer.send('set-side'),
  collapse: () => ipcRenderer.send('collapse-menu'),
  backspace: () => ipcRenderer.send('back-space'),
  pause: () => ipcRenderer.send('pause-button'),
  speech: () => ipcRenderer.send('speech-mode'),
  text: () => ipcRenderer.send('text-mode')
})