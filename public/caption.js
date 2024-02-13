const { ipcRenderer } = require("electron")
const input = document.getElementById('text-input')
const container = document.getElementById('container')
const body = document.getElementById('body')

// input.onmouseover = e => {
//   e.target.innerHTML = e.target.innerText.replace(/([\w]+)/g, '<span>$1</span>');
// };

input.onmouseover = e => {
    e.target.innerHTML =
        e.target.innerText.replace(/([\w]+)/g, '<span>$1</span>');
    e.target.onclick = e => {
        // ipcRenderer.send("error-word", e.target.textContent)
        ipcRenderer.send("error-word", input.innerText)
    };
}

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

// when done is pressed return font to full size
