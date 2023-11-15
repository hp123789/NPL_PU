const arrow = document.getElementById('triangle')
const pause = document.getElementById('pause')
const hoverListener = document.getElementById('hoverListener')
const deleteBtn = document.getElementById('delete')
const speech = document.getElementById('speech')

let isHidden = false

arrow.addEventListener('click', () => window.electronAPI.setSide())

pause.addEventListener('click', () => {
    window.electronAPI.collapse()
    if (!isHidden) {
        pause.style.marginTop = "calc(50vh - 35px)"
        arrow.style.display = "none"
        deleteBtn.style.display = "none"
        speech.style.display = "none"
        isHidden = !isHidden
        setTimeout(function() {
            hoverListener.style.backgroundColor = "rgba(25, 17, 26, 0.1)"
        }, 5000)
        setTimeout(function() {
            pause.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
        }, 5000)
    }
    else {
        arrow.style.display = "initial"
        deleteBtn.style.display = "initial"
        speech.style.display = "initial"
        isHidden = !isHidden
        pause.style.marginTop = "calc(0.1 * 100vh)"
    }
})

hoverListener.addEventListener("mouseenter", () => {
    hoverListener.style.backgroundColor = "rgba(25, 17, 26, 1)"
    pause.style.backgroundColor = "rgba(255, 255, 255, 1)"
})

deleteBtn.addEventListener("click", () => {
    window.electronAPI.backspace()
})