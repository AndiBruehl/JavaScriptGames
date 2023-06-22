const board = document.getElementById('board');
const cells = [];
let currentPlayer = 'X';
let xMoves = [];
let oMoves = [];

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
        cells.push(cell);
        cell.addEventListener('click', () => makeMove(i));
    }
}

function makeMove(index) {
    if (cells[index].textContent === '') {
        cells[index].textContent = currentPlayer;
        cells[index].style.backgroundImage = 'none';
        cells[index].classList.add('clicked');
        cells[index].style.backgroundColor = currentPlayer === 'X' ? 'lightblue' : 'lightcoral';
        if (currentPlayer === 'X') {
            currentPlayer = 'O';
            xMoves.push(index);
            setTimeout(() => {
                botMove();
            }, 100);
        } else {
            currentPlayer = 'X';
            oMoves.push(index);
        }
        gameFinished();
    }
}

function gameFinished() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const combination = winningCombinations[i];
        if (combination.every(value => xMoves.includes(value))) {
            finishGame('Glückwunsch! :)\nSie haben gewonnen!');
            return;
        }
        if (combination.every(value => oMoves.includes(value))) {
            finishGame('Leider Pech gehabt! :(\nDer Computer hat gewonnen');
            return;
        }
    }

    const totalMove = oMoves.length + xMoves.length;
    if (totalMove === 9 && !xMoves.length === !oMoves.length) {
        finishGame('Unentschieden');
        return;
    }
}

function finishGame(text) {
    setTimeout(() => {
        if (!alert(text)) {
            window.location.reload();
        }
    }, 100);
}

function botMove() {
    const availableMoves = cells.reduce((acc, cell, index) => {
        if (cell.textContent === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const index = availableMoves[randomIndex];
    cells[index].style.backgroundImage = 'none';
    cells[index].textContent = 'O';
    cells[index].style.backgroundColor = 'lightcoral'; 
    oMoves.push(index);

    currentPlayer = 'X';
    cells[index].classList.add('clicked');
}

createBoard();

