const arrow = document.getElementById('switch')
const pause = document.getElementById('pause')
const hoverListener = document.getElementById('hoverListener')
const deleteBtn = document.getElementById('delete')
const speech = document.getElementById('speech')
const text = document.getElementById('text')
const done = document.getElementById('done')
const textdiv = document.getElementById('text-div')
const speechdiv = document.getElementById('speech-div')
const menu = document.getElementById('menu')
const container = document.getElementById('container')
const bar1 = document.getElementById('bar1')
const bar2 = document.getElementById('bar2')
const bar3 = document.getElementById('bar3')
const line1 = document.getElementById('line1')
const line2 = document.getElementById('line2')
// const playsound = document.getElementById('playsound')

let isHidden = false
let speechMode = false
let leftSide = true
let paused = false
bar1.style.width = "25px"
bar2.style.width = "30px"
text.style.filter = "invert(71%) sepia(12%) saturate(1805%) hue-rotate(187deg) brightness(99%) contrast(108%)"
done.style.filter = "invert(52%) sepia(23%) saturate(8%) hue-rotate(41deg) brightness(89%) contrast(83%)"

arrow.addEventListener('click', () => {
    window.electronAPI.setSide()
    if (leftSide) {
        container.style.flexDirection = "row-reverse"
        bar1.style.marginRight = "0"
        bar1.style.marginLeft = "auto"
        bar2.style.marginRight = "0"
        bar2.style.marginLeft = "auto"
        leftSide = !leftSide
    } else {
        container.style.flexDirection = "row"
        bar1.style.marginRight = "auto"
        bar1.style.marginLeft = "0"
        bar2.style.marginRight = "auto"
        bar2.style.marginLeft = "0"
        leftSide = !leftSide
    }
})

menu.addEventListener('click', () => {
    window.electronAPI.collapse()
    if (!isHidden) {
        if (leftSide) {
            // fix this
            menu.style.marginLeft = "30px"
        } else {
            // fix this
            menu.style.marginRight = "30px"
        }
        bar1.style.width = "35px"
        bar2.style.width = "35px"
        arrow.style.display = "none"
        deleteBtn.style.display = "none"
        pause.style.display = "none"
        speech.style.display = "none"
        done.style.display = "none"
        text.style.display = "none"
        line1.style.display = "none"
        line2.style.display = "none"
        isHidden = !isHidden
    }
    else {
        bar1.style.width = "25px"
        bar2.style.width = "30px"
        arrow.style.display = "initial"
        deleteBtn.style.display = "initial"
        pause.style.display = "initial"
        speech.style.display = "initial"
        isHidden = !isHidden
        menu.style.marginLeft = "initial"
        done.style.display = "initial"
        text.style.display = "initial"
        line1.style.display = "initial"
        line2.style.display = "initial"
    }
})

// hoverListener.addEventListener("mouseover", () => {
//     hoverListener.style.backgroundColor = "rgba(25, 17, 26, 1)"
//     pause.style.opacity = "1"
//     text.style.opacity = "1"
//     deleteBtn.style.opacity = "1"
//     arrow.style.opacity = "1"
//     speech.style.opacity = "1"
//     done.style.opacity = "1"
//     menu.style.opacity = "1"
// })

// hoverListener.addEventListener("mouseleave", () => {
//     setTimeout(function() {
//         hoverListener.style.backgroundColor = "rgba(25, 17, 26, 0.5)"
//         pause.style.opacity = "0.5"
//         text.style.opacity = "0.5"
//         deleteBtn.style.opacity = "0.5"
//         arrow.style.opacity = "0.5"
//         speech.style.opacity = "0.5"
//         done.style.opacity = "0.5"
//         menu.style.opacity = "0.5"
//     }, 5000)
// })

deleteBtn.addEventListener("click", () => {
    window.electronAPI.backspace()
})

speech.addEventListener("click", () => {
    speechMode = true
    speech.style.filter = "invert(71%) sepia(12%) saturate(1805%) hue-rotate(187deg) brightness(99%) contrast(108%)"
    text.style.filter = "invert(100%) sepia(100%) saturate(0%) hue-rotate(29deg) brightness(105%) contrast(104%)"
    // deleteBtn.style.filter = "invert(52%) sepia(23%) saturate(8%) hue-rotate(41deg) brightness(89%) contrast(83%)"
    done.style.filter = "initial"
    deleteBtn.classList.remove("dehov")

    window.electronAPI.speech()
})

text.addEventListener("click", () => {
    speechMode = false
    speech.style.filter = "invert(100%) sepia(100%) saturate(0%) hue-rotate(29deg) brightness(105%) contrast(104%)"
    text.style.filter = "invert(71%) sepia(12%) saturate(1805%) hue-rotate(187deg) brightness(99%) contrast(108%)"
    done.style.filter = "invert(52%) sepia(23%) saturate(8%) hue-rotate(41deg) brightness(89%) contrast(83%)"
    // deleteBtn.style.filter = "invert(100%) sepia(100%) saturate(0%) hue-rotate(29deg) brightness(105%) contrast(104%)"
    document.getElementById("delete").classList.add("dehov")

    window.electronAPI.text()
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