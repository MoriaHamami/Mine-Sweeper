'use strict'

function checkGameOver(location) {
    const boardSize = gBoard.length * gBoard[0].length
    const currCell = gBoard[location.i][location.j]

    if (!gGame.lives) playerLost(currCell, location)
    else if (gGame.shownCount + gGame.corrMarkedCount === boardSize) playerWon()

}

function playerLost(currCell, location) {
    clearInterval(gInterval)
    showAllMines()
    currCell.isShown = true
    renderCell(location, WRONG_MINE_IMG, currCell.isShown)
    updateIcons(1, '.restart-btn', LOST)
    gGame.isOn = false
}

function playerWon() {
    clearInterval(gInterval)
    showAllMines()
    updateIcons(1, '.restart-btn', WON)
    updateBestTime()
    gGame.isOn = false
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) renderCell({ i, j }, MINE_IMG, true)
        }
    }
}




