'use strict'

function buildBoard() {
    if (gGame.is7Boom) return get7BoomBoard()
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

function renderBoard(mat, selector) {

    var strHTML = '<table border="1"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const className = `cell cell-${i}-${j}`

            strHTML += `<td oncontextmenu="return false;" onmouseup="cellClicked(${i}, ${j}, event)" class="${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value, isShown) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
    if (isShown) elCell.style.backgroundColor = 'rgb(142, 124, 124)'
    else elCell.style.backgroundColor = 'rgb(171, 158, 158)'

}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function revealFirstEncounter(i, j) {
    const currCell = gBoard[i][j]
    setMines(gBoard, { i, j })
    setMinesNegsCount(gBoard)
    startTimer()
    currCell.isShown = true
    renderCell({ i, j }, '', currCell.isShown)
    gIsFirstClick = false
}

function getEmptyRandCells(amount, board, currLocation) {
    const emptyCells = []

    const boardSize = board.length * board[0].length
    const idxOptions = Array.from(Array(boardSize).keys())

    //Remove current idx from array of options
    const currIdx = currLocation.i * board[0].length + currLocation.j
    idxOptions.splice(currIdx, 1)

    for (var i = 0; i < amount; i++) {
        const idx = getRandomItem(idxOptions)
        // Find indexes by converting array idx to mat idx
        const i = Math.floor(idx / board.length)
        const j = idx % board[0].length
        emptyCells.push({ i, j })

        const idxToRemove = idxOptions.indexOf(idx)
        idxOptions.splice(idxToRemove, 1)

    }
    return emptyCells
}

function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length)

    // get random item
    const item = arr[randomIndex]

    return item
}

function updateIcons(amount, selector, icon) {
    var el = document.querySelector(selector)
    var str = ''
    for (var i = 0; i < amount; i++) {
        str += icon
    }
    if (str) el.innerText = str
    else el.innerText = 0
}

function getEmptyRandIdx() {
    const emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMine) emptyCells.push({ i, j })
        }
    }
    if (!emptyCells.length) return null
    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
