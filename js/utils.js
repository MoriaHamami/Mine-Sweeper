'use strict'

function buildBoard() {
    if(gGame.is7Boom) return get7BoomBoard()
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
    if(!emptyCells.length) return null
    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
// function onMark(elBtn) {
//     // TODO: change text in the button
//     gIsMark = !gIsMark
//     elBtn.innerText = gIsMark ? 'Unmark' : 'Mark'
//     // TODO: mark all spans inside .box
//     const elSpans = document.querySelectorAll('.box span')
//     for (let i = 0; i < elSpans.length; i++) {
//         const elSpan = elSpans[i];
//         elSpan.classList.toggle('mark')
//     }
// }

// function createMat(rows, cols) {
//     const mat = []
//     for (var i = 0; i < rows; i++) {
//         const row = []
//         for (var j = 0; j < cols; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }



// // CREATE_BOARD_2D
// function createNums() {

//     const nums = []
//     for (var i = 0; i < gSize; i++) {
//         nums.push(i + 1)
//     }
//     const randNums = shuffle(nums)
//     return randNums

// }

// //CREATE_BOARD_3D
// function createBoard() {
//     const board = []
//     for (var i = 0; i < 8; i++) {
//         board.push([])
//         for (var j = 0; j < 8; j++) {
//             board[i][j] = (Math.random() > 0.5) ? LIFE : ''
//             // board[i][j] = (i === 0 || i === 7 || j === 0 || j === 7) ? LIFE : ''
//         }
//     }
//     return board
// }

// //RENDER_2D
// function renderQuest() {
//     var strHTML = ''
//     const currQuest = gQuests[gCurrQuestIdx]
//     const opts = currQuest.opts
//     const elBtns = document.querySelector('.btns')
//     for (var i = 0; i < opts.length; i++) {
//         const currOpt = opts[i]
//         strHTML += `<button class="btn" onclick="checkAnswer(${i},this)">${currOpt}</button>`
//     }
//     elBtns.innerHTML = strHTML
//     const elImage = document.querySelector('.quest-img')
//     elImage.src = `img/${currQuest.id}.webp`

// }



// // Returns the class name for a specific cell
// function getClassName(location) {
//     const cellClass = 'cell-' + location.i + '-' + location.j
//     return cellClass
// }

// // Convert a location object {i, j} to a selector and render a value in that element
// function renderCell(location, value) {
//     const cellSelector = '.' + getClassName(location) // cell-i-j
//     const elCell = document.querySelector(cellSelector)
//     elCell.innerHTML = value
// }

// function shuffle(items) {
//     var randIdx, keep
//     for (var i = items.length - 1; i > 0; i--) {
//         randIdx = getRandomInt(0, items.length)
//         keep = items[i]
//         items[i] = items[randIdx]
//         items[randIdx] = keep
//     }
//     return items
// }



// function openModal() {
//     // Todo: show the modal and schedule its closing
//     const elModal = document.querySelector('.modal')
//     elModal.style.display = 'block'
//     if (gTimeoutId) clearTimeout(gTimeoutId)
//     gTimeoutId = setTimeout(onCloseModal, 5000)
// }

// function onCloseModal() {
//     // Todo: hide the modal
//     const elModal = document.querySelector('.modal')
//     elModal.style.display = 'none'
// }




// function getRandomIntInclusive(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF'
//     var color = '#'
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)]
//     }
//     return color
// }

// function hideElement(selector) {
//     const el = document.querySelector(selector)
//     el.classList.add('hidden')
// }

// function showElement(selector) {
//     const el = document.querySelector(selector)
//     el.classList.remove('hidden')
// }

// function playSound() {
//     var sound = new Audio('sound/pop.mp3')
//     sound.play()
// }

// function isEmptyCell(coord) {
//     return gBoard[coord.i][coord.j] === ''
// }

// function markCells(coords) {
//     for (var i = 0; i < coords.length; i++) {
//         var coord = coords[i]
//         var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`)
//         elCell.classList.add('mark')
//     }
// }

// // Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
// function getCellCoord(strCellId) {
//     var parts = strCellId.split('-')
//     var coord = { i: +parts[1], j: +parts[2] }
//     return coord
// }




