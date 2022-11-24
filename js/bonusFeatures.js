'use strict'

const HINT = '💡'
const SAFE = '✅'

var gIsHint
var gIsPuttingMines
var gMineLocations

function showSafeCell(elBtn) {

    if (gIsFirstClick) return

    elBtn.style.backgroundColor = 'rgba(216, 219, 168, 0.5)'

    const location = getEmptyRandIdx()
    const cellSelector = '.' + getClassName(location) // .cell-i-j
    const elSafeCell = document.querySelector(cellSelector)
    elSafeCell.style.backgroundColor = 'rgb(237, 146, 146)'

    // If there are no empty cells return
    if (location === null) return

    var intervalId = setTimeout(() => {
        elSafeCell.style.backgroundColor = 'rgb(171, 158, 158)'
        elBtn.style.backgroundColor = ''
        clearInterval(intervalId)
    }, 2000)
    gGame.safeClicks--
    updateIcons(gGame.safeClicks, '.safe-click', SAFE)

}

function useHint(elBtn) {
    if (gGame.hints === 0) return
    elBtn.style.backgroundColor = 'rgba(216, 219, 168, 0.5)'
    gIsHint = true
}

function revealHint(i, j) {
    toggleNeighbors({ i, j })
    var intervalId = setTimeout(() => {
        gIsHint = false
        var elHints = document.querySelector('.hints')
        elHints.style.backgroundColor = ''
        toggleNeighbors({ i, j })
        clearInterval(intervalId)
    }, 1000)
    gGame.hints--
    updateIcons(gGame.hints, '.hints', HINT)
}

// Work in progress
function darkMode() {
    // const elBody = document.querySelector('body')
    // if(gGame.isDark) {
    //     elBody.classList.remove('dark')
    //     gGame.isDark = true
    // } else {
    //     elBody.classList.add('dark')
    //     gGame.isDark = false
    // }
}

function boom(elBtn) {
    // Turn off manual mode if on
    if (gGame.isManual) {
        gGame.isManual = false
        restartVars()
        const elManual = document.querySelector('.manual')
        elManual.style.backgroundColor = 'rgb(199, 194, 194)'
    }

    if (gGame.is7Boom) {
        elBtn.style.backgroundColor = 'rgb(199, 194, 194)'
        gGame.is7Boom = false
        restartVars()
    } else {
        elBtn.style.backgroundColor = 'rgb(142, 124, 124)'
        gGame.is7Boom = true
        restartVars()
    }
}

function get7BoomBoard() {
    const size = gGame.currLevel.SIZE
    var board = []
    var count = 0

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            const isDivisableBy7 = count % 7 === 0
            count++

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: isDivisableBy7,
                isMarked: false
            }
        }
    }
    return board
}

function manual(elBtn) {
    // Turn off 7 BOOM if game is on
    if (gGame.is7Boom) {
        gGame.is7Boom = false
        restartVars()
        const elBoom = document.querySelector('.boom')
        elBoom.style.backgroundColor = 'rgb(199, 194, 194)'
    }

    if (gGame.isManual) {
        gGame.isManual = false
        // const elMsg = document.querySelector('.msg')
        // elMsg.hidden = false
        // gIsPuttingMines = false
        gMineLocations = []
        restartVars()
        elBtn.style.backgroundColor = 'rgb(199, 194, 194)'
    } else {
        elBtn.style.backgroundColor = 'rgb(142, 124, 124)'
        gGame.isManual = true
        restartVars()
    }
}

function letUserPutMines(i, j) {
    const curCell = gBoard[i][j]

    if (curCell.isShown) {
        curCell.isMine = false
        curCell.isShown = false
        const idxToRemove = gMineLocations.indexOf({ i, j })
        gMineLocations.splice(idxToRemove, 1)
        renderCell({ i, j }, null, false)
    } else {
        curCell.isMine = true
        curCell.isShown = true
        gMineLocations.push({ i, j })
        renderCell({ i, j }, MINE_IMG, true)
    }
}

function minesPlaced(elMsg) {
    elMsg.hidden = true
    gIsPuttingMines = false
    hideAllMines()
    gMineLocations = []
}

function hideAllMines() {
    for (var idx = 0; idx < gMineLocations.length; idx++) {
        gBoard[gMineLocations[idx].i][gMineLocations[idx].j].isShown = false
        renderCell(gMineLocations[idx], null, false)
    }
}


