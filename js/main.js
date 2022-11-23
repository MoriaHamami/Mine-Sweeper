'use strict'

const MINE = '&#x1F4A3'
const FLAG = '🚩'
const MINE_IMG = '<img src="img/mine.png">'
const WRONG_MINE_IMG = '<img src="img/wrongMine.png">'
const WON = '😁'
const LOST = '😖'
const NORMAL = '😊'

var gBoard
var gLevel
var gIsFirstClick
var gGame
var gInterval

function initGame() {

    gLevel = {
        beginner: { SIZE: 4, MINES: 2 },
        medium: { SIZE: 8, MINES: 14 },
        expert: { SIZE: 12, MINES: 32 }
    }

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        currLevel: gLevel.beginner
    }

    restartVars()
}

function restartVars() {
    stopTimer()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    gIsFirstClick = true
    gGame.isOn = true
}

function buildBoard() {
    const size = gGame.currLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }

    }
    return board
}

function cellClicked(elCell, i, j, ev) {
    const currCell = gBoard[i][j]

    // Don't mark the first cell
    if (gIsFirstClick && ev.button === 2) return

    // First cell clicked
    if (gIsFirstClick) {
        setMines(gBoard, { i, j })
        setMinesNegsCount(gBoard)
        startTimer()
        currCell.isShown = true
        renderCell({i, j},'', currCell.isShown)
        gIsFirstClick = false
    }

    // Open cell according to encounter
    if (ev.button === 2) {
        cellMarked({ i, j })
    } else if (currCell.isMine) {
        if (currCell.isMarked) return
        showMine({ i, j })
    } else {
        if (currCell.isMarked) return
        showNearNegs({ i, j })
    }

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
        renderCell(location, null, currCell.isShown)
    } else {
        currCell.isMarked = true
        renderCell(location, FLAG, currCell.isShown)
    }
}

function showMine(location) {
    gBoard[location.i][location.j].isShown = true
    renderCell(location, MINE_IMG, true)
}

function showNearNegs(location) {
    var currCell = gBoard[location.i][location.j]
    if (currCell.minesAroundCount) { // If there is a number in cell
        gBoard[location.i][location.j].isShown = true
        const strHTML = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
        renderCell(location, strHTML, currCell.isShown)
    } else { // If there is an empty cell
        // Show current cell
        currCell.isShown = true
        renderCell(location, null, currCell.isShown)
        // Check other cells
        expandShown(gBoard, location.i, location.j)
    }
}

function expandShown(board, i, j) {

    for (var nextI = i - 1; nextI <= i + 1; nextI++) {
        // Skip if cell is not on board
        if (nextI < 0 || nextI >= board.length) continue
        for (var nextJ = j - 1; nextJ <= j + 1; nextJ++) {
            // Skip if the cell is not on board
            if (nextJ < 0 || nextJ >= board[0].length) continue
            // Skip if we checked this cell
            if (nextI === i && nextJ === j) continue

            const currCell = gBoard[nextI][nextJ]
            // Skip if this is a marked, or shown cell 
            if (currCell.isMarked || currCell.isShown) continue

            // If found a cell to open, reveal it
            currCell.isShown = true
            if (currCell.minesAroundCount) {
                const strHTML = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
                renderCell({i: nextI, j: nextJ}, strHTML, currCell.isShown)
            } else {
                renderCell({i: nextI, j :nextJ}, null, currCell.isShown)
                // If there aren't any mines nearby, keep looking for closed cells 
                expandShown(board, nextI, nextJ)
            }
        }
    }

}

function changeLevel(level) {
    gGame.currLevel = gLevel[level]
    restartVars()
    console.log('gGame.currLevel:', gGame.currLevel)
}

function checkGameOver() {
    stopTimer()

}

function stopTimer() {
    clearInterval(gInterval)
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = '00 : 00 : 00'
}


