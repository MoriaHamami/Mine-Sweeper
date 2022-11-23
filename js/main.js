'use strict'

const MINE = '&#x1F4A3'
const RED_FLAG = '🚩'
const MINE_IMG = '<img src="img/mine.png">'
const WRONG_MINE_IMG = '<img src="img/wrongMine.png">'
const WON = '😁'
const LOST = '😖'
const NORMAL = '😊'

var gBoard
var gLevel
var gIsFirstClick
var gGame

function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    gLevel = {
        beginner: {
            SIZE: 4,
            MINES: 2
        },
        medium: {
            SIZE: 8,
            MINES: 14
        },
        expert: {
            SIZE: 12,
            MINES: 32
        }
    }

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    gIsFirstClick = true
    gGame.isOn = true
}
// restartVars()

function buildBoard() {
    const size = gLevel.beginner.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
        }

    }
    return board
}

function setMines(board, currCell) {
    var minesCount = gLevel.beginner.MINES
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

function cellClicked(elCell, i, j, ev) {
    const currCell = gBoard[i][j]
    if (gIsFirstClick) {
        setMines(gBoard, { i, j })
        setMinesNegsCount(gBoard)
        gIsFirstClick = false
        return
    } else if(ev === "right-click") {
        currCell.isMarked = true
        showFlag({i, j})
    } else if (currCell.isMine) {
        showMine({i, j})
    } else {
        showNearNegs({i, j})
    }
}

function showFlag(location) {
    renderCell(location, FLAG)
}

function showMine(location) {
    renderCell(location, MINE_IMG)
}

function showNearNegs(location) {
    var currCell = gBoard[location.i][location.j]
    if (currCell.minesAroundCount) {
        const strHTML = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
        renderCell(location, strHTML)
    } else {
        //show neighbors
    }
}



// // Gets a string such as:  'cell cell-2-7' and returns {i:2, j:7}
// function getCellCoord(strCellId) {
//     var specificStr = strCellId.slice(5)
//     var parts = specificStr.split('-')
//     var coord = { i: +parts[1], j: +parts[2] }
//     return coord
// }

// function hideCell(location) {
//     document.querySelector(`.cell-${location.i}-${location.j}`).hidden = true
//     gElSelectedSeat.classList.remove('selected')
// }
// function showCell(location) {
//     document.querySelector(`.cell-${location.i}-${location.j}`).hidden = true
//     gElSelectedSeat.classList.remove('selected')
// }
// function cleanBoard() {
//     var elTds = document.querySelectorAll('.mark, .selected')
//     for (var i = 0; i < elTds.length; i++) {
//         elTds[i].classList.remove('mark', 'selected')
//     }
// }
// function markCells(coords) {
//     for (var i = 0; i < coords.length; i++) {
//         var coord = coords[i]
//         var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`)
//         elCell.classList.add('mark')
//     }
// }
// function bookSeat(elBtn) {
//     console.log('Booking seat, button: ', elBtn)
//     const i = +elBtn.dataset.i
//     const j = +elBtn.dataset.j

//     //book the seat
//     gCinema[i][j].isBooked = true
//     renderCinema()
//     unSelectSeat()
// }

// function unSelectSeat() {
//     hideSeatDetails()
//     gElSelectedSeat.classList.remove('selected')
//     gElSelectedSeat = null
// }

// cellMarked(elCell)
// checkGameOver()
// expandShown(board, elCell, i, j)

// const PACMAN = '🦸'
// const PACMAN_IMG = '<img src="img/pacman.jpg">'

// var gPacman
// var gWasOnPowerFood
// var gDeadGhosts
// const WALL = '🧱'

// const EMPTY = ' '
// const POWER_FOOD = '🍰'
// const CHERRY = '🍒'

// const gGame = {
//     score: 0,
//     isOn: false,
//     foodCount: -1
// }

// var gBoard
// var gIntervalCherries
// var gIsVictorious


// function restartVars() {
//     gIsVictorious = false
//     gWasOnPowerFood = false
//     gGame.foodCount = -1
//     gGame.score = 0
//     updateScore(0)
//     showElement('.board-container')
//     hideElement('h1')
//     hideElement('button')
//     hideElement('.victorious')
//     gGhosts = []
//     gDeadGhosts = []
// }

// function createCherries(board) {
//     gIntervalCherries = setInterval(() => {
//         const emptyCell = getEmptyRandCell()
//         //If empty cell found put a cherry
//         if (emptyCell !== -1) {
//             // Update Model
//             board[emptyCell.i][emptyCell.j] = CHERRY
//             // Update DOM
//             renderCell(emptyCell, CHERRY)
//         }
//     }, 15000)
// }



// function updateScore(diff) {
//     // Model
//     gGame.score += diff
//     // DOM
//     document.querySelector('h2 span').innerText = gGame.score

// }

// function gameOver() {
//     clearInterval(gIntervalGhosts)
//     clearInterval(gIntervalCherries)
//     gGame.isOn = false

//     if (gIsVictorious) {
//         var timeoutId = setTimeout(() => {
//             hideElement('.board-container')
//             showElement('.victorious')
//             showElement('button')
//             clearTimeout(timeoutId)
//         }, 2000)
//     } else {
//         renderCell(gPacman.location, '🪦')
//         var timeoutId = setTimeout(() => {
//             showElement('h1')
//             showElement('button')
//             hideElement('.board-container')
//             clearTimeout(timeoutId)
//         }, 2000)
//     }

// }

// function createPacman(board) {
//     // DONE: initialize gPacman...
//     gPacman = {
//         location: {
//             i: 2,
//             j: 2
//         },
//         isSuper: false
//     }
//     board[gPacman.location.i][gPacman.location.j] = PACMAN
//     renderCell(gPacman.location, PACMAN_IMG)

// }

// function movePacman(ev) {
//     if (!gGame.isOn) return
//     // DONE: use getNextLocation(), nextCell
//     const nextLocation = getNextLocation(ev.key)
//     const nextCell = gBoard[nextLocation.i][nextLocation.j]

//     // DONE: return if cannot move
//     if (nextCell === WALL) return

//     // DONE: hitting a ghost? call gameOver
//     checkIfOnGhost(nextCell, nextLocation)

//     updateScores(nextCell)

//     changeLocation(nextLocation)

//     // TASK 4 - Keep power food when player is super
//     if (nextCell === POWER_FOOD && gPacman.isSuper) gWasOnPowerFood = true

//     checkIfOnPowerFood(nextCell)

//     checkIfVictory()

// }

// function getNextLocation(eventKeyboard) {
//     // console.log(eventKeyboard)
//     const nextLocation = {
//         i: gPacman.location.i,
//         j: gPacman.location.j
//     }
//     // DONE: figure out nextLocation
//     switch (eventKeyboard) {
//         case 'ArrowUp':
//             nextLocation.i--
//             break;
//         case 'ArrowRight':
//             nextLocation.j++
//             break;
//         case 'ArrowDown':
//             nextLocation.i++
//             break;
//         case 'ArrowLeft':
//             nextLocation.j--
//             break;
//     }
//     return nextLocation
// }

// function checkIfOnGhost(nextCell, nextLocation) {
//     if (nextCell === GHOST) {
//         if (gPacman.isSuper) { // Task 4 - Power food
//             const ghostIdxToRemove = getGhostIdxByLocation(nextLocation.i, nextLocation.j)
//             const currGhost = gGhosts[ghostIdxToRemove]
//             //Update Model
//             gDeadGhosts.push(currGhost)
//             gGhosts.splice(ghostIdxToRemove, 1)
//             //Update DOM
//             if (currGhost.currCellContent === FOOD) gFoodCount--
//             renderCell(currGhost.location, currGhost.currCellContent)
//         } else {
//             gameOver()
//             return
//         }
//     }
// }

// function updateScores(thisCell) {
//     if (thisCell === FOOD) {
//         updateScore(1)
//         gFoodCount--
//     }
//     // TASK 5- Cherry
//     if (thisCell === CHERRY) {
//         updateScore(10)
//     }
// }

// function changeLocation(nextLocation) {
//     // DONE: moving from current location:
//     if (gWasOnPowerFood) {
//         // Task 4 - Power food
//         // Model
//         gBoard[gPacman.location.i][gPacman.location.j] = POWER_FOOD
//         // DOM
//         renderCell(gPacman.location, POWER_FOOD)
//         gWasOnPowerFood = false
//     } else {
//         // Model
//         gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
//         // DOM
//         renderCell(gPacman.location, EMPTY)
//     }

//     // DONE: Move the pacman to new location:
//     // Model
//     gBoard[nextLocation.i][nextLocation.j] = PACMAN
//     gPacman.location = nextLocation
//     // DOM
//     renderCell(nextLocation, PACMAN_IMG)
// }

// function checkIfOnPowerFood(thisCell) {
//     // Task 4 - Power food
//     if (thisCell === POWER_FOOD && !gPacman.isSuper) {
//         gPacman.isSuper = true
//         changeGhostsColor()
//         var intervalId = setInterval(() => {
//             gPacman.isSuper = false
//             reviveGhosts()
//             changeGhostsColor()
//             clearInterval(intervalId)
//         }, 5000)
//     }
// }

// function checkIfVictory() {
//     // TASK 1+2- Victory
//     if (gFoodCount === 1) {
//         gIsVictorious = true
//         gameOver()
//         return
//     }
// }