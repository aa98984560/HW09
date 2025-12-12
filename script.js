// 遊戲主變數
let board = Array(9).fill(null); 
let current = 'X'; 
let active = true; 
const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

// 所有勝利組合
const WINS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// 1. 初始化棋盤 (負責建立棋盤格子)
function init() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board = Array(9).fill(null);
    active = true;
    current = HUMAN_PLAYER;
    document.getElementById('status').innerText = '玩家(X) 先手';

    // 建立9個格子
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => playerMove(i);
        boardEl.appendChild(cell);
    }
}

// 2. 更新畫面 (負責將 board 陣列內容寫入格子)
function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        cells[i].innerText = board[i] || "";
    }
}

// 3. 玩家下棋
function playerMove(i) {
    if (!active || board[i]) return;
    
    board[i] = HUMAN_PLAYER;
    updateBoard();

    if (checkWin(HUMAN_PLAYER)) {
        endGame('玩家(X)勝利!');
        return;
    } else if (isFull()) {
        endGame('平手!');
        return;
    }
    
    current = AI_PLAYER;
    document.getElementById('status').innerText = '電腦思考中...';
    // 給予電腦思考時間
    setTimeout(computerMove, 700); 
}

// 4. 電腦AI：使用 Minimax 選擇最佳走位 (增強邏輯)
function computerMove() {
    let bestMove = -1;
    let bestScore = -Infinity;
    
    const emptySpots = board.map((v, i) => v === null ? i : null).filter(v => v !== null);

    for (let i of emptySpots) {
        // 1. 嘗試走這一步
        board[i] = AI_PLAYER;
        
        // 2. 計算這一步帶來的 Minimax 分數 (從玩家的回合開始)
        let score = minimax(board, HUMAN_PLAYER); 
        
        // 3. 撤銷這一步
        board[i] = null;

        // 4. 找到最高分的分數和對應的走位
        if (score > bestScore) {
            bestScore = score;
            bestMove = i;
        }
    }

    // 執行最佳走位
    if (bestMove !== -1) {
        board[bestMove] = AI_PLAYER;
        updateBoard();

        if (checkWin(AI_PLAYER)) {
            endGame('電腦(O)勝利!');
        } else if (isFull()) {
            endGame('平手 ! ');
        } else {
            current = HUMAN_PLAYER;
            document.getElementById('status').innerText = '輪到玩家(X)';
        }
    }
}

// 5. Minimax 演算法的核心遞歸函數
function minimax(currentBoard, player) {
    // 檢查終止條件：如果遊戲結束，返回分數
    const score = checkTerminalState();
    if (score !== null) {
        return score; 
    }

    const emptySpots = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);

    if (player === AI_PLAYER) {
        // AI: Maximize score (最大化分數)
        let maxScore = -Infinity;
        for (let i of emptySpots) {
            currentBoard[i] = AI_PLAYER; 
            let currentScore = minimax(currentBoard, HUMAN_PLAYER); 
            currentBoard[i] = null; 
            maxScore = Math.max(maxScore, currentScore);
        }
        return maxScore;
    } else {
        // Human: Minimize score (最小化分數)
        let minScore = Infinity;
        for (let i of emptySpots) {
            currentBoard[i] = HUMAN_PLAYER; 
            let currentScore = minimax(currentBoard, AI_PLAYER); 
            currentBoard[i] = null; 
            minScore = Math.min(minScore, currentScore);
        }
        return minScore;
    }
}

// 6. 檢查當前棋盤狀態的評分
function checkTerminalState() {
    if (checkWin(AI_PLAYER)) return 10;
    if (checkWin(HUMAN_PLAYER)) return -10;
    if (isFull()) return 0;
    return null;
}

// 7. 判斷勝利
function checkWin(player) {
    for (let [a, b, c] of WINS) {
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// 8. 判斷是否平手
function isFull() {
    return board.every(cell => cell !== null);
}

// 9. 結束遊戲
function endGame (message) {
    document.getElementById('status').innerText = message;
    active = false;
}

// 10. 重開一局 (綁定給按鈕)
function resetGame() {
    init();
}

// 11. 初始化 (網頁載入時執行)
init();