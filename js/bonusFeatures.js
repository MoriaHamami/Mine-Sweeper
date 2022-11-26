'use strict'

const HINT = '💡'
const DARK = '🌑'
const BRIGHT = '☀️'
const SAFE = '✅'

var gIsHint
var gIsMegaHint
var gIsPuttingMines
var gMineLocations
var gCellsToReveal

function showSafeCell(elBtn) {

    if (!gGame.isOn) return
    if (gIsFirstClick) return
    if(!gGame.safeClicks) return
    elBtn.style.backgroundColor = 'rgba(216, 219, 168, 0.5)'

    const location = getEmptyRandIdx()

    // If there are no empty cells return
    if (location === null) return elBtn.style.backgroundColor = ''

    const cellSelector = '.' + getClassName(location) // .cell-i-j
    const elSafeCell = document.querySelector(cellSelector)
    elSafeCell.style.backgroundColor = 'rgb(237, 146, 146)'
    if (gGame.safeClicks === 1) {
        elBtn.style.backgroundColor = ''
        elBtn.classList.add('done')
    }

    gIsProcessing = true
    var intervalId = setTimeout(() => {
        elSafeCell.style.backgroundColor = ''
        elBtn.style.backgroundColor = ''
        gIsProcessing = false
        clearInterval(intervalId)
    }, 2000)
    gGame.safeClicks--
    updateIcons(gGame.safeClicks, '.safe-click', SAFE)

}

function useHint(elBtn) {
    if (gGame.hints === 0 || gIsFirstClick) return
    // If the user clicks again in order to turn off feature
    if (gIsHint && !gIsProcessing) {
        elBtn.style.backgroundColor = ''
        gIsHint = false
        return
    }
    elBtn.style.backgroundColor = 'rgba(216, 219, 168, 0.5)'
    gIsHint = true
}

function revealHint(i, j) {
    toggleNeighbors({ i, j })
    var elHints = document.querySelector('.hints')
    if (gGame.hints === 1) {
        elHints.style.backgroundColor = ''
        elHints.classList.add('done')
    }
    gIsProcessing = true
    var intervalId = setTimeout(() => {
        gIsHint = false
        elHints.style.backgroundColor = ''
        toggleNeighbors({ i, j })
        clearInterval(intervalId)
        gIsProcessing = false
    }, 1000)
    gGame.hints--
    updateIcons(gGame.hints, '.hints', HINT)
}

function boom(elBtn) {
    if(gIsProcessing) return
    // Turn off manual mode if on
    if (gGame.isManual) {
        gGame.isManual = false
        gIsPuttingMines = false
        restartVars()
        const elManual = document.querySelector('.manual')
        elManual.style.backgroundColor = ''
        const elMsg = document.querySelector('.msg')
        elMsg.hidden = true
    }

    if (gGame.is7Boom) {
        elBtn.style.backgroundColor = ''
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
    if(gIsProcessing) return
    // Turn off 7 BOOM if game is on
    if (gGame.is7Boom) {
        gGame.is7Boom = false
        restartVars()
        const elBoom = document.querySelector('.boom')
        elBoom.style.backgroundColor = ''
    }

    if (gGame.isManual) {
        gGame.isManual = false
        const elMsg = document.querySelector('.msg')
        elMsg.hidden = true
        gIsPuttingMines = false
        gMineLocations = []
        restartVars()
        elBtn.style.backgroundColor = ''
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

function megaHint(elBtn) {
    if (gIsFirstClick) return
    if (!gGame.megaHint) return
    if(gIsProcessing) return
    // If the user clicks again in order to turn off feature
    if (gIsMegaHint === 2) {
        elBtn.style.backgroundColor = ''
        gIsMegaHint = 0
        return
    }
    gIsMegaHint = 2
    elBtn.style.backgroundColor = 'rgb(142, 124, 124)'
}

function revealMegaHint(i, j) {
    if (gIsMegaHint === 2) { // If this is the first click
        renderCell({ i, j }, null, true)
        gCellsToReveal.push({ i, j })
    } else {
        gCellsToReveal.push({ i, j })
        toggleArea()
        gIsProcessing = true
        var intervalId = setTimeout(() => {
            var elMegaHint = document.querySelector('.mega-hint')
            elMegaHint.style.backgroundColor = ''
            gGame.megaHint = 0
            toggleArea()
            gCellsToReveal = []
            gIsProcessing = false
            clearInterval(intervalId)
        }, 2000)
    }
}

function toggleArea() {

    const startI = gCellsToReveal[0].i
    const startJ = gCellsToReveal[0].j
    const endI = gCellsToReveal[1].i
    const endJ = gCellsToReveal[1].j
    // If marked wrong, don't reveal
    if ((startI >= endI || startJ >= endJ) && gGame.megaHint !== 0) return
    // If marked wrong, get another mega hint and hide chosen cells
    if ((startI >= endI || startJ >= endJ) && gGame.megaHint === 0) {
        renderCell({ i: startI, j: startJ }, null, false)
        renderCell({ i: endI, j: endJ }, null, false)
        gGame.megaHint = 1
        return
    }

    var state = null
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            const toReveal = gGame.megaHint ? true : false
            const currCell = gBoard[i][j]
            if (currCell.isShown) continue
            if (toReveal) {
                if (currCell.minesAroundCount) {
                    state = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
                }
                if (currCell.isMine) state = MINE_IMG
            }
            renderCell({ i, j }, state, toReveal)
            if (currCell.isMarked && !toReveal) renderCell({ i, j }, FLAG, false)
            state = null
        }

    }
}

function exterminator(elBtn) {
    if (!gGame.isOn) return
    if (gIsFirstClick) return
    if (!gGame.exterminator) return
    if(gIsProcessing) return

    const randCells = getRandSpecificCells(3, gBoard)
    // If there are no empty cells return
    if (location === null) return
    elBtn.style.backgroundColor = 'rgb(142, 124, 124)'

    showMinesToRemove(randCells, elBtn)
    renderNeighbors(randCells)

    gGame.exterminator--
}

function showMinesToRemove(cells, elBtn) {

    gIsProcessing = true

    const cellSelector1 = '.' + getClassName(cells[0]) // .cell-i-j
    const elMineCell1 = document.querySelector(cellSelector1)
    elMineCell1.style.backgroundColor = 'rgb(237, 146, 146)'
    var currCell = gBoard[cells[0].i][cells[0].j]
    currCell.isMine = false
    if(currCell.isMarked) gGame.corrMarkedCount--
    
    if (cells.length > 1) {
        const cellSelector2 = '.' + getClassName(cells[1])
        var elMineCell2 = document.querySelector(cellSelector2)
        elMineCell2.style.backgroundColor = 'rgb(237, 146, 146)'
        currCell = gBoard[cells[1].i][cells[1].j]
        currCell.isMine = false
        if(currCell.isMarked) gGame.corrMarkedCount--
    }
    
    if (cells.length === 3) {
        const cellSelector3 = '.' + getClassName(cells[2])
        var elMineCell3 = document.querySelector(cellSelector3)
        elMineCell3.style.backgroundColor = 'rgb(237, 146, 146)'
        currCell = gBoard[cells[2].i][cells[2].j]
        currCell.isMine = false
        if(currCell.isMarked) gGame.corrMarkedCount--
    }

    const intervalId = setTimeout(() => {
        elMineCell1.style.backgroundColor = ''
        if (cells.length > 1) elMineCell2.style.backgroundColor = ''
        if (cells.length === 3) elMineCell3.style.backgroundColor = ''

        elBtn.style.backgroundColor = ''
        gIsProcessing = false
        clearInterval(intervalId)
    }, 3000)

}

function getRandSpecificCells(amount, board) {
    const specifiedCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine && !board[i][j].isShown) specifiedCells.push({ i, j })
        }
    }

    // Create an array with index options
    const idxOptions = Array.from(Array(specifiedCells.length).keys())

    //If the amount of hidden mines is less than amount needed, decrease amount
    if (specifiedCells.length < amount) amount = specifiedCells.length

    const chosenCells = []
    for (var i = 0; i < amount; i++) {
        const idx = getRandomItem(idxOptions)
        chosenCells.push(specifiedCells[idx])
        // Remove the index from options
        const idxToRemove = idxOptions.indexOf(idx)
        idxOptions.splice(idxToRemove, 1)
    }

    return chosenCells
}

function darkMode(elBtn) {
    const elBody = document.querySelector('body')
    const elBtns = document.querySelectorAll('button')
    const elContainer = document.querySelector('.container')
    const elH2 = document.querySelector('h2')
    const elTable = document.querySelectorAll('td')

    if (gGame.isDark) turnBright(elBtn, elBody, elBtns, elContainer, elH2, elTable)
    else turnDark(elBtn, elBody, elBtns, elContainer, elH2, elTable)
}

function turnBright(elBtn, elBody, elBtns, elContainer, elH2, elTable) {
    elBody.classList.remove('dark')
    elContainer.classList.remove('dark')
    elH2.classList.remove('dark')
    for (const button of elBtns) {
        button.classList.remove('dark')
    }
    for (const td of elTable) {
        td.classList.remove('dark')
    }
    gGame.isDark = false
    elBtn.innerText = DARK
}

function turnDark(elBtn, elBody, elBtns, elContainer, elH2, elTable) {
    elBody.classList.add('dark')
    elContainer.classList.add('dark')
    elH2.classList.add('dark')
    for (const button of elBtns) {
        button.classList.add('dark')
    }
    for (const td of elTable) {
        td.classList.add('dark')
    }
    gGame.isDark = true
    elBtn.innerText = BRIGHT
}

