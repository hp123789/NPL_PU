const { ipcRenderer } = require("electron")

const text = document.getElementById("text-input")
const btn = document.getElementById('help')

ipcRenderer.on('senddata', (event, args) => {
    text.innerText = args
})