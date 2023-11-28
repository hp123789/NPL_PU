const { ipcRenderer } = require("electron")

ipcRenderer.on("message", (event, accessToken) => {
    document.getElementById("text-input").innerText = accessToken;
});