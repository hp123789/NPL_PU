const arrow = document.getElementById('triangle')
const pause = document.getElementById('pause')
const hoverListener = document.getElementById('hoverListener')
const deleteBtn = document.getElementById('delete')
const speech = document.getElementById('speech')

let isHidden = false

arrow.addEventListener('click', () => window.electronAPI.setSide())

speech.addEventListener('click', () => {
    window.electronAPI.collapse()
    if (!isHidden) {
        speech.style.marginTop = "calc(50vh - 35px)"
        arrow.style.display = "none"
        deleteBtn.style.display = "none"
        pause.style.display = "none"
        isHidden = !isHidden
    }
    else {
        arrow.style.display = "initial"
        deleteBtn.style.display = "initial"
        pause.style.display = "initial"
        isHidden = !isHidden
        speech.style.marginTop = "calc(0.1 * 100vh)"
    }
})

hoverListener.addEventListener("mouseover", () => {
    hoverListener.style.backgroundColor = "rgba(25, 17, 26, 1)"
    pause.style.opacity = "1"
    speech.style.opacity = "1"
    deleteBtn.style.opacity = "1"
    arrow.style.opacity = "1"
})

hoverListener.addEventListener("mouseleave", () => {
    setTimeout(function() {
        hoverListener.style.backgroundColor = "rgba(25, 17, 26, 0.5)"
        pause.style.opacity = "0.5"
        speech.style.opacity = "0.5"
        deleteBtn.style.opacity = "0.5"
        arrow.style.opacity = "0.5"
    }, 5000)
})

deleteBtn.addEventListener("click", () => {
    window.electronAPI.backspace()
})