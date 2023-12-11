const arrow = document.getElementById('switch')
const pause = document.getElementById('pause')
const hoverListener = document.getElementById('hoverListener')
const deleteBtn = document.getElementById('delete')
const done = document.getElementById('done')
const menu = document.getElementById('menu')
const container = document.getElementById('container')
const bar1 = document.getElementById('bar1')
const bar2 = document.getElementById('bar2')
const bar3 = document.getElementById('bar3')


let isHidden = false
let speechMode = false
let leftSide = true
let paused = false
bar1.style.width = "25px"
bar2.style.width = "30px"
// done.style.filter = "invert(52%) sepia(23%) saturate(8%) hue-rotate(41deg) brightness(89%) contrast(83%)"

arrow.addEventListener('click', () => {
    window.electronAPI.setSide()
    if (leftSide) {
        leftSide = !leftSide
    } else {
        leftSide = !leftSide
    }
})

menu.addEventListener('click', () => {
    window.electronAPI.collapse()
    if (!isHidden) {
        if (leftSide) {
            // fix this
            menu.style.marginLeft = "23px"
        } else {
            // fix this
            menu.style.marginLeft = "23px"
        }
        bar1.style.width = "35px"
        bar2.style.width = "35px"
        arrow.style.display = "none"
        deleteBtn.style.display = "none"
        pause.style.display = "none"
        done.style.display = "none"
        isHidden = !isHidden
    }
    else {
        bar1.style.width = "25px"
        bar2.style.width = "30px"
        arrow.style.display = "initial"
        deleteBtn.style.display = "initial"
        pause.style.display = "initial"
        isHidden = !isHidden
        menu.style.marginLeft = "initial"
        done.style.display = "initial"
    }
})

deleteBtn.addEventListener("click", () => {
    window.electronAPI.backspace()
})


pause.addEventListener("click", () => {
    window.electronAPI.pause()
    paused = !paused
    if (paused) {
        pause.src = './images/play.svg'
    } else {
        pause.src = './images/pause.svg'
    }
})

done.addEventListener("click", () => {
    window.electronAPI.done()
})

// playsound.addEventListener("mouseover", () => {
//     playsound.style.scale = "1.3"
// })

// playsound.addEventListener("click", () => {
//     window.electronAPI.play()
// })