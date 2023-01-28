'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function startTimer() {
    gTimerInterval = setInterval(() => {
        gGame.secsPassed++
        var elH2 = document.querySelector('.timer')
        elH2.innerText = '0' + gGame.secsPassed + ' ⏱️'
    }, 1000);
}


function getEmptyCells(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                cells.push({ i, j })
            } else i--
        }
    } return cells
}

function drawRandomCell(cells) {
    var randIdx = getRandomInt(0, cells.length)
    return cells.splice(randIdx, 1)[0]
}


function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


