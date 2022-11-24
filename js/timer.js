'use strict'

function startTimer() {
    var elTimer = document.querySelector('.timer span')
    var seconds = 0
    var minutes = 0
    var hours = 0

    gInterval = setInterval(() => {

        seconds += 1;
        if (seconds === 60) {
            seconds = 0
            minutes++
            if (minutes === 60) {
                minutes = 0
                hours++
            }
        }

        const h = hours < 10 ? '0' + hours : hours
        const m = minutes < 10 ? '0' + minutes : minutes
        const s = seconds < 10 ? '0' + seconds : seconds

        elTimer.innerText = `${h} : ${m} : ${s}`
        gGame.gameTime.str = `${h} : ${m} : ${s}`
        gGame.gameTime.num++

    }, 1000)
}

function resetTimer() {
    clearInterval(gInterval)
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = '00 : 00 : 00'
}

function updateBestTime() {
    const bestTime = getBestTimeInNum()
    if (bestTime === 0 || bestTime <= gGame.gameTime.num) {
        localStorage.setItem(gGame.currLevel.SIZE, gGame.gameTime.str)
        const elBestTime = document.querySelector('.best-time span')
        elBestTime.innerText = gGame.gameTime.str 
    }
}

function getBestTimeInNum(){
    const time = localStorage.getItem(gGame.currLevel.SIZE)
    if(!time) return 0
    var parts = time.split(' : ')
    const timeInSecs = +parts[0] + +parts[1] * 60 + +parts[2] * 60 * 60
    return timeInSecs
}