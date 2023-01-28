'use strict'


//***THE GAME STILL NOT WORKING PROPERLY***


const MINE = '💣'
const NORMAL = '🙂'
const LOSE = '🤯'
const WIN = '😎'
const FLAG = '🚩'



var gBoard
var gStartTime
var gTimerInterval
var gGame

var elRestartBtn = document.querySelector('.restart-btn')
var gLevel = {
    size: 4,
    mines: 2
}

function onInit() {
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    resetGame()
}

function resetGame() {
    gGame = {
        isOn: false,
        isFirstClick: true,
        shownCount: 0,
        secsPassed: 0,
        flagCount: 0,
        lives: 3
    }
    var lives = document.querySelector('.lives').innerText
    document.querySelector('.lives').innerText = lives

    clearInterval(gTimerInterval)
    document.querySelector('.timer').innerText = '000 ⏱️'
    elRestartBtn.innerText = NORMAL
}

function buildBoard(size) {
    var size = gLevel.size
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            const cell = {
                i: i,
                j: j,
                minesAroundCount: ' ',
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // board[0][0].isMine = true
    // board[1][2].isMine = true
    return board;
}

function onChangeLevel(size, mines) {
    gLevel.size = size
    gLevel.mines = mines
    onInit()
}


function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = `cell cell-${i}-${j}`

            if (!currCell.isMine) {
                currCell = currCell.minesAroundCount
            }
            else {
                currCell = MINE
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="plantFlag(this,${i},${j})">${currCell}</td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}



function setMinesNegCount(cellI, cellJ, board) {
    var minesAroundCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}


function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    currCell.isShown = true
    elCell.classList.add('opened')
    gGame.shownCount++


    if (gGame.isFirstClick) {
        if (!gTimerInterval) startTimer()
        gGame.shownCount++
        findMines(currCell)
        negsCount(gBoard)
        gGame.isFirstClick = false
        gGame.isOn = true
    }

    if (currCell.isMine) {
        elCell.innerText = MINE
        gGame.lives--
        var lives = document.querySelector('.lives').innerText
        lives = lives.slice(2)
        document.querySelector('.lives').innerText = lives

        if (checkGameOver()) {
            gGame.isOn = false
            elRestartBtn.innerText = LOSE
            clearInterval(gTimerInterval)
        }
    }

    if (!currCell.isMine) {
        elCell.style.color = '#c54914'
        elCell.innerText = currCell.minesAroundCount
    }

}


function plantFlag(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (!gTimerInterval) startTimer()
    if (currCell.isShown) return

    if (gGame.isOn) {

        if (!currCell.isMarked) {
           
            elCell.style.color = 'rgb(255, 0, 0)'
            elCell.innerText = FLAG
            gGame.flagCount++
        }

        if (currCell.isMarked) {
            elCell.innerText = ''
            elCell.style.color = 'transparent'
            gGame.flagCount--
        }
        currCell.isMarked = !currCell.isMarked
    }
    if (checkGameOver()) {
        elRestartBtn.innerText = WIN
        clearInterval(gTimerInterval)
    }
}


function onCellMarked(ev, i, j ) {
    ev.preventDefault()
    // console.log('ok');
    // gBoard[i][j].isMarked =  !gBoard[i][j].isMarked
    // renderCell({i,j},MARK)


    // Called when a cell is right- clicked See how you can h ide the context
    // menu on right click
}



function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells are shown
    if (gGame.shownCount + gGame.markedMines === gLevel.size * gLevel.size) { 
        gGame.isOn = false
        clearInterval(gTimerInterval)
        document.querySelector('.restart-btn').innerText = WON
        if (gGame.lives === 0 || gGame.shownCount >= (gLevel.size ** 2) - gLevel.mines
        || gGame.shownCount >= gLevel.size ** 2 ){
            gGame.isOn = false
            clearInterval(gTimerInterval)
            document.querySelector('.restart-btn').innerText = LOSE
            
        }
    }
}

function negsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = setMinesNegCount(i, j, board)
        }
    }
}

function findMines(currCell) {
    var cells = getEmptyCells(gBoard)
    var location = drawRandomCell(cells)
    console.log('location = ', location)
    for (var i = 0; i < gLevel.mines; i++) {
        location = drawRandomCell(cells)
        if (currCell !== location) {
            gBoard[location.i][location.j].isMine = true
        } else {
            location = drawRandomCell(cells)
            gBoard[location.i][location.j].isMine = true
        }
    }
}



