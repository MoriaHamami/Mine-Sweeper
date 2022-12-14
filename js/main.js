'use strict'

const FLAG = '🚩'
const MINE_IMG = '<img src="img/mine.png">'
const WRONG_MINE_IMG = '<img src="img/wrongMine.png">'
const WON = '😁'
const LOST = '😖'
const NORMAL = '😊'
const LIFE = '❤️'

var gBoard
var gIsFirstClick
var gIsProcessing
var gPrevLevel
var gLevel = {
    beginner: { SIZE: 4, MINES: 3 },
    medium: { SIZE: 8, MINES: 14 },
    expert: { SIZE: 12, MINES: 32 }
}
var gGame = {
    isOn: true,
    isDark: false,
    is7Boom: false,
    isManual: false,
    gameTime: { num: 0, str: '' },
    shownCount: 0,
    corrMarkedCount: 0,
    lives: 3,
    hints: 3,
    safeClicks: 3,
    megaHint: 1,
    exterminator: 1,
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

    const elBtn = document.querySelector(`.beginner`)
    elBtn.style.backgroundColor = 'rgb(142, 124, 124)'

    gPrevLevel = 'beginner'
    gIsProcessing = false
    gIsFirstClick = true
    gIsHint = false
    gIsPuttingMines = false
    gMineLocations = []
    gCellsToReveal = []
}

function restartVars() {

    if(gIsProcessing) return
    
    resetTimer()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

    // If player was in the middle of a hint or mega hint, turn off
    const elMegaHint = document.querySelector('.mega-hint')
    if (gIsMegaHint === 2) {
        elMegaHint.style.backgroundColor = ''
        gIsMegaHint = 0
    }
    const elHint = document.querySelector('.hints')
    if (gIsHint && !gIsProcessing) {
        elHint.style.backgroundColor = ''
        gIsHint = false
    }

    gIsFirstClick = true
    gIsHint = false
    gGame.corrMarkedCount = 0
    gGame.shownCount = 0
    gIsMegaHint = 0
    updateIcons(1, '.restart-btn', NORMAL)

    gGame.lives = 3
    gGame.safeClicks = 3
    gGame.hints = 3
    gGame.megaHint = 1
    gGame.exterminator = 1
    updateIcons(3, '.lives', LIFE)
    updateIcons(3, '.hints', HINT)
    updateIcons(3, '.safe-click', SAFE)

    const elHints = document.querySelector('.hints')
    const elSafeClicks= document.querySelector('.safe-click')
    elHint.classList.remove('done')
    elSafeClicks.classList.remove('done')

    gGame.gameTime.num = 0
    gGame.isOn = true
    if (gGame.isManual) {
        document.querySelector('.msg').hidden = false
        gIsPuttingMines = true
    }
}

function changeLevel(level, elBtn) {

    if(gIsProcessing) return

    // Update level
    gGame.currLevel = gLevel[level]

    //Change button marked as selected
    if (level !== gPrevLevel) {
        const elPrevLevel = document.querySelector(`.${gPrevLevel}`)
        elPrevLevel.style.backgroundColor = ''
        elBtn.style.backgroundColor = 'rgb(142, 124, 124)'
    }

    // Update best time per level
    const bestTime = localStorage.getItem(gGame.currLevel.SIZE)
    const elBestTime = document.querySelector('.best-time span')
    if (bestTime) elBestTime.innerText = bestTime
    else elBestTime.innerText = '00 : 00 : 00'
    gPrevLevel = level
    restartVars()
}

function cellClicked(i, j, ev) {
    const currCell = gBoard[i][j]
    if (!gGame.isOn) return
    // Don't let user click cell if there is an interval running
    if (gIsProcessing) return
    // Don't mark the first cell
    if (gIsFirstClick && ev.button === 2) return
    // Don't accept double-click 
    if (currCell.isShown && !gIsPuttingMines) return

    // For manual mode
    if (gIsPuttingMines) return letUserPutMines(i, j)

    // First cell clicked
    if (gIsFirstClick) revealFirstEncounter(i, j)

    // This click is used with hint
    if (gIsHint) return revealHint(i, j)

    // This click is used with mega hint
    if (gIsMegaHint) {
        revealMegaHint(i, j)
        gIsMegaHint--
        return
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

function revealFirstEncounter(i, j) {
    const currCell = gBoard[i][j]
    if (!gGame.is7Boom && !gGame.isManual) setMines(gBoard, { i, j })
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

function cellMarked(location) {
    const currCell = gBoard[location.i][location.j]
    if (currCell.isMarked) {
        currCell.isMarked = false
        if (currCell.isMine) gGame.corrMarkedCount--
        renderCell(location, null, currCell.isShown)
    } else {
        currCell.isMarked = true
        if (currCell.isMine) gGame.corrMarkedCount++
        renderCell(location, FLAG, currCell.isShown)
        checkGameOver({ i: location.i, j: location.j })
    }
}

function showMine(location) {
    const currCell = gBoard[location.i][location.j]
    currCell.isShown = true
    gGame.shownCount++
    renderCell(location, MINE_IMG, true)
}
