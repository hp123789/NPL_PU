const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setSide: () => ipcRenderer.send('set-side'),
  collapse: () => ipcRenderer.send('collapse-menu'),
  backspace: () => ipcRenderer.send('back-space')
})