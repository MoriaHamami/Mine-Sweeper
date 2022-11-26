'use strict'

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

function showNearNegs(location) {
    const currCell = gBoard[location.i][location.j]
    if (currCell.minesAroundCount) { // If there is a number in cell
        currCell.isShown = true
        gGame.shownCount++
        const strHTML = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
        renderCell(location, strHTML, currCell.isShown)
    } else { // If there is an empty cell
        // Show current cell
        currCell.isShown = true
        gGame.shownCount++
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
            recurRevealCells(board, nextI, nextJ)
        }
    }

}

function recurRevealCells(board, nextI, nextJ) {
    const currCell = gBoard[nextI][nextJ]
    currCell.isShown = true
    gGame.shownCount++
    if (currCell.minesAroundCount) {
        const strHTML = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
        renderCell({ i: nextI, j: nextJ }, strHTML, currCell.isShown)
    } else {
        renderCell({ i: nextI, j: nextJ }, null, currCell.isShown)
        // If there aren't any mines nearby, keep looking for closed cells 
        expandShown(board, nextI, nextJ)
    }
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

// Show neighbors then hide them
function toggleNeighbors({ i, j }) {
    var state = null
    for (var nextI = i - 1; nextI <= i + 1; nextI++) {
        if (nextI < 0 || nextI >= gBoard.length) continue
        for (var nextJ = j - 1; nextJ <= j + 1; nextJ++) {
            if (nextJ < 0 || nextJ >= gBoard[nextI].length) continue
            const currCell = gBoard[nextI][nextJ]
            if (currCell.isShown) continue
            if (gIsHint) {
                if (currCell.minesAroundCount) {
                    state = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
                }
                if (currCell.isMine) state = MINE_IMG
            }
            renderCell({ i: nextI, j: nextJ }, state, gIsHint)
            if (currCell.isMarked && !gIsHint) renderCell({ i: nextI, j: nextJ }, FLAG, false)
            state = null
        }
    }
}

// Cells were changed, so change neighbors count around them
function renderNeighbors(cells) {
    // For each mine removed
    for (var currIdx = 0; currIdx < cells.length; currIdx++) {
        
        // Go over their neighbors
        var neighborsCount=0
        for (var i = cells[currIdx].i - 1; i <= cells[currIdx].i + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue
            for (var j = cells[currIdx].j - 1; j <= cells[currIdx].j + 1; j++) {
                // Don't go over the cell that had the mine
                if (i === cells[currIdx].i && j === cells[currIdx].j) continue
                if (j < 0 || j >= gBoard[i].length) continue
                
                const currCell = gBoard[i][j]
                if (currCell.isMine) neighborsCount++

                // If the current cell will have 0 neighbors around it 
                // and is shown, remove content from cell
                if (currCell.minesAroundCount === 1 && currCell.isShown) {
                    currCell.minesAroundCount--
                    renderCell({ i, j }, null, currCell.isShown)
                } else if (currCell.minesAroundCount) {
                    currCell.minesAroundCount--
                    if (currCell.isShown) {
                        const strHTML = `<span class="color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`
                        renderCell({ i, j }, strHTML, currCell.isShown)
                    }
                }

            }
        }
        // Update the mines count around cell that had the mine
        gBoard[cells[currIdx].i][cells[currIdx].j].minesAroundCount = neighborsCount

    }
}