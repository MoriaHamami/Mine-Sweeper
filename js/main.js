'use strict'

const FLAG = '🚩'
const MINE_IMG = '<img src="img/mine.png">'
const WRONG_MINE_IMG = '<img src="img/wrongMine.png">'
const WON = '😁'
const LOST = '😖'
const NORMAL = '😊'
const LIFE = '❤️'
const HINT = '💡'
const SAFE = '✅'

var gBoard
var gInterval
var gIsFirstClick
var gIsHint
var gLevel = {
    beginner: { SIZE: 4, MINES: 2 },
    medium: { SIZE: 8, MINES: 14 },
    expert: { SIZE: 12, MINES: 32 }
}
var gGame = {
    isOn: true,
    gameTime: { num: 0, str: '' },
    shownCount: 0,
    corrMarkedCount: 0,
    lives: 3,
    hints: 3,
    safeClicks: 3,
    currLevel: gLevel.beginner
}

function initGame() {
    resetTimer()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

    // Update best time of beginner level
    const bestTime = localStorage.getItem(gGame.currLevel.SIZE)
    const elBestTime = document.querySelector('.best-time span')
    if (bestTime) elBestTime.innerText = bestTime

    gIsFirstClick = true
    gIsHint = false
}

function restartVars() {
    resetTimer()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

    gIsFirstClick = true
    gIsHint = false
    gGame.corrMarkedCount = 0
    gGame.shownCount = 0
    updateIcons(1, '.restart-btn', NORMAL)

    gGame.lives = 3
    gGame.safeClicks = 3
    updateIcons(3, '.lives', LIFE)
    updateIcons(3, '.hints', HINT)
    updateIcons(3, '.safe-click', SAFE)

    gGame.gameTime.num = 0
    gGame.isOn = true
}

function changeLevel(level) {
    gGame.currLevel = gLevel[level]
    // Update best time per level
    const bestTime = localStorage.getItem(gGame.currLevel.SIZE)
    console.log('bestTime:', bestTime)
    const elBestTime = document.querySelector('.best-time span')
    if (bestTime) elBestTime.innerText = bestTime
    else elBestTime.innerText = '00 : 00 : 00'
    restartVars()
}

function cellClicked(i, j, ev) {
    const currCell = gBoard[i][j]

    if (!gGame.isOn) return
    // Don't mark the first cell
    if (gIsFirstClick && ev.button === 2) return
    // Don't accept double-click
    if (currCell.isShown) return

    // First cell clicked
    if (gIsFirstClick) updateFirstEncounter(i, j)

    // This click is used with hint
    if (gIsHint) {
        toggleNeighbors({ i, j })
        var intervalId = setTimeout(() => {
            gIsHint = false
            var elHints = document.querySelector('.hints')
            toggleNeighbors({ i, j })
            elHints.style.backgroundColor = ''
            clearInterval(intervalId)
        }, 1000)
        gGame.hints--
        updateIcons(gGame.hints, '.hints', HINT)
    }

    // Open cell according to encounter
    if (ev.button === 2) {
        cellMarked({ i, j })
    } else if (currCell.isMine) {
        if (currCell.isMarked) return
        if (gGame.lives) {
            showMine({ i, j })
            gGame.lives--
            updateIcons(gGame.lives, '.lives', LIFE)
            checkGameOver({ i, j })
        }
    } else {
        if (currCell.isMarked) return
        showNearNegs({ i, j })
        checkGameOver({ i, j })
    }

}

function showHint() {
    if (gGame.hints === 0) return
    gIsHint = true
    var elHints = document.querySelector('.hints')
    elHints.style.backgroundColor = 'rgba(216, 219, 168, 0.5)'
}

function updateFirstEncounter(i, j) {
    const currCell = gBoard[i][j]
    setMines(gBoard, { i, j })
    setMinesNegsCount(gBoard)
    startTimer()
    currCell.isShown = true
    renderCell({ i, j }, '', currCell.isShown)
    gIsFirstClick = false
}

function setMines(board, currCell) {
    var minesCount = gGame.currLevel.MINES
    var emptyIdxs = getEmptyRandCells(minesCount, gBoard, currCell)
    for (var i = 0; i < emptyIdxs.length; i++) {
        const currIdx = emptyIdxs[i]
        board[currIdx.i][currIdx.j].isMine = true
    }
}

function setMinesNegsCount(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!(currCell.isMine)) {
                currCell.minesAroundCount = countNeighbors(i, j, gBoard)
            }
        }
    }
}

function cellMarked(location) {
    const currCell = gBoard[location.i][location.j]
    if (currCell.isMarked) {
        currCell.isMarked = false
        if (currCell.isMine) gGame.corrMarkedCount++
        renderCell(location, null, currCell.isShown)
        checkGameOver({ i: location.i, j: location.j })
    } else {
        currCell.isMarked = true
        if (currCell.isMine) gGame.corrMarkedCount++
        renderCell(location, FLAG, currCell.isShown)
    }
}

function showMine(location) {
    const currCell = gBoard[location.i][location.j]
    currCell.isShown = true
    gGame.shownCount++
    renderCell(location, MINE_IMG, true)
}

function showSafeCell() {

    if(gIsFirstClick) return

    const elSafeClick = document.querySelector('.safe-click')
    elSafeClick.style.backgroundColor = 'rgba(216, 219, 168, 0.5)'

    const location = getEmptyRandIdx()
    const cellSelector = '.' + getClassName(location) // .cell-i-j
    const elSafeCell = document.querySelector(cellSelector)
    elSafeCell.style.backgroundColor = 'rgb(142, 124, 124)'

    // If there are no empty cells return
    if (location) return

    var intervalId = setTimeout(() => {
        elSafeCell.style.backgroundColor = 'rgb(171, 158, 158)'
        elSafeClick.style.backgroundColor = ''
        clearInterval(intervalId)
    }, 2000)
    gGame.safeClicks--
    updateIcons(gGame.safeClicks, '.safe-click', SAFE)

}


