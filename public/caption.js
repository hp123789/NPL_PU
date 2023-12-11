const { ipcRenderer } = require("electron")
const input = document.getElementById('text-input')
const container = document.getElementById('container')
const body = document.getElementById('body')

ipcRenderer.on("message", (event, accessToken) => {
    document.getElementById("text-input").innerText = accessToken;
    resize()
});

function resize() {
    while (input.clientHeight > body.clientHeight) {
        let fontSize = window.getComputedStyle(input).fontSize;
        input.style.fontSize = (parseFloat(fontSize) - 10) + 'px';
    }
}
