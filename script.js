const SIZE = 4;

let board = [];
let score = 0;
let gameOver = false;
let won = false;
let continuePlaying = false;


// Lấy các phần tử HTML

const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");

const overlay = document.getElementById("overlay");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");

const newGameButton = document.getElementById("new-game");
const restartGameButton = document.getElementById("restart-game");
const continueButton = document.getElementById("continue-game");


// Lấy điểm cao nhất

let bestScore = localStorage.getItem("2048-best-score") || 0;

bestScoreElement.textContent = bestScore;


// Khởi tạo game

function initGame() {

    board = [];

    score = 0;

    gameOver = false;

    won = false;

    continuePlaying = false;

    overlay.classList.remove("show");

    // Tạo bảng 4 x 4

    for (let i = 0; i < SIZE; i++) {

        board[i] = [];

        for (let j = 0; j < SIZE; j++) {

            board[i][j] = 0;

        }

    }

    // Tạo 2 số ban đầu

    addRandomTile();

    addRandomTile();

    updateBoard();

}


// Tạo một ô số ngẫu nhiên

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });

            }

        }

    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomCell =
        emptyCells[
            Math.floor(Math.random() * emptyCells.length)
        ];

    // 90% xuất hiện số 2
    // 10% xuất hiện số 4

    board[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;

}


// Hiển thị bảng game

function updateBoard() {

    gameBoard.innerHTML = "";

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const value = board[row][col];

            const tile = document.createElement("div");

            tile.classList.add("tile");

            if (value !== 0) {

                tile.textContent = value;

                if (value <= 2048) {

                    tile.classList.add("tile-" + value);

                } else {

                    tile.classList.add("tile-super");

                }

            }

            gameBoard.appendChild(tile);

        }

    }

    scoreElement.textContent = score;

}


// Xử lý khi nhấn phím

document.addEventListener("keydown", function (event) {

    if (gameOver) {
        return;
    }

    let moved = false;

    switch (event.key) {

        case "ArrowLeft":
        case "a":
        case "A":

            event.preventDefault();

            moved = moveLeft();

            break;


        case "ArrowRight":
        case "d":
        case "D":

            event.preventDefault();

            moved = moveRight();

            break;


        case "ArrowUp":
        case "w":
        case "W":

            event.preventDefault();

            moved = moveUp();

            break;


        case "ArrowDown":
        case "s":
        case "S":

            event.preventDefault();

            moved = moveDown();

            break;

    }

    if (moved) {

        addRandomTile();

        updateBoard();

        checkGameState();

    }

});


// Di chuyển sang trái

function moveLeft() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const originalRow = [...board[row]];

        let newRow = board[row].filter(value => value !== 0);

        newRow = mergeRow(newRow);

        while (newRow.length < SIZE) {

            newRow.push(0);

        }

        board[row] = newRow;

        if (!arraysEqual(originalRow, newRow)) {

            moved = true;

        }

    }

    return moved;

}


// Di chuyển sang phải

function moveRight() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const originalRow = [...board[row]];

        let newRow = board[row].filter(value => value !== 0);

        newRow = newRow.reverse();

        newRow = mergeRow(newRow);

        newRow = newRow.reverse();

        while (newRow.length < SIZE) {

            newRow.unshift(0);

        }

        board[row] = newRow;

        if (!arraysEqual(originalRow, newRow)) {

            moved = true;

        }

    }

    return moved;

}


// Di chuyển lên

function moveUp() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let originalColumn = [];

        let column = [];

        for (let row = 0; row < SIZE; row++) {

            originalColumn.push(board[row][col]);

            if (board[row][col] !== 0) {

                column.push(board[row][col]);

            }

        }

        column = mergeRow(column);

        while (column.length < SIZE) {

            column.push(0);

        }

        for (let row = 0; row < SIZE; row++) {

            board[row][col] = column[row];

        }

        if (!arraysEqual(originalColumn, column)) {

            moved = true;

        }

    }

    return moved;

}


// Di chuyển xuống

function moveDown() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let originalColumn = [];

        let column = [];

        for (let row = 0; row < SIZE; row++) {

            originalColumn.push(board[row][col]);

            if (board[row][col] !== 0) {

                column.push(board[row][col]);

            }

        }

        column.reverse();

        column = mergeRow(column);

        column.reverse();

        while (column.length < SIZE) {

            column.unshift(0);

        }

        for (let row = 0; row < SIZE; row++) {

            board[row][col] = column[row];

        }

        if (!arraysEqual(originalColumn, column)) {

            moved = true;

        }

    }

    return moved;

}


// Gộp các số giống nhau

function mergeRow(row) {

    for (let i = 0; i < row.length - 1; i++) {

        if (row[i] === row[i + 1]) {

            row[i] = row[i] * 2;

            score += row[i];

            row.splice(i + 1, 1);

        }

    }

    return row;

}


// So sánh 2 mảng

function arraysEqual(array1, array2) {

    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {

        if (array1[i] !== array2[i]) {
            return false;
        }

    }

    return true;

}


// Kiểm tra trạng thái game

function checkGameState() {

    // Kiểm tra chiến thắng

    if (!won) {

        for (let row = 0; row < SIZE; row++) {

            for (let col = 0; col < SIZE; col++) {

                if (board[row][col] === 2048) {

                    won = true;

                    showWinMessage();

                    updateBestScore();

                    return;

                }

            }

        }

    }


    // Kiểm tra Game Over

    if (!canMove()) {

        gameOver = true;

        updateBestScore();

        showGameOverMessage();

    }


    updateBestScore();

}


// Kiểm tra còn di chuyển được không

function canMove() {

    // Nếu còn ô trống

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {
                return true;
            }

        }

    }


    // Kiểm tra các ô ngang

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE - 1; col++) {

            if (board[row][col] === board[row][col + 1]) {
                return true;
            }

        }

    }


    // Kiểm tra các ô dọc

    for (let col = 0; col < SIZE; col++) {

        for (let row = 0; row < SIZE - 1; row++) {

            if (board[row][col] === board[row + 1][col]) {
                return true;
            }

        }

    }

    return false;

}


// Cập nhật điểm cao nhất

function updateBestScore() {

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "2048-best-score",
            bestScore
        );

        bestScoreElement.textContent = bestScore;

    }

}


// Hiển thị thông báo chiến thắng

function showWinMessage() {

    messageTitle.textContent = "🎉 Bạn thắng!";

    messageText.textContent =
        "Chúc mừng! Bạn đã tạo được ô 2048.";

    continueButton.style.display = "inline-block";

    overlay.classList.add("show");

}


// Hiển thị Game Over

function showGameOverMessage() {

    messageTitle.textContent = "💀 Game Over!";

    messageText.textContent =
        "Bạn không còn nước đi nào nữa.";

    continueButton.style.display = "none";

    overlay.classList.add("show");

}


// Nút chơi lại

newGameButton.addEventListener("click", function () {

    initGame();

});

restartGameButton.addEventListener("click", function () {

    initGame();

});


// Tiếp tục chơi sau khi đạt 2048

continueButton.addEventListener("click", function () {

    continuePlaying = true;

    overlay.classList.remove("show");

});


// Bắt đầu game

initGame();