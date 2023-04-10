// NAVIGATION
function navToGame() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game-frame").classList.remove("hidden");
  reset();
}

function back() {
  document.getElementById("game-frame").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function start(mode) {
  console.log(mode)
  globals.gameMode = mode;
  if (mode === "human") {
    navToGame();
    hideButtons(["play-second"]);
  } else if (mode === "minimax") {
    navToGame();
    showButtons(["play-second"]);
  } else if (mode === "q-tables") {
    navToGame();
    showButtons(["play-second"]);
  } else {
    console.log("Else");
  }
}

let globals = {
  gameMode: "human",
}

// BOARD IS COL-ROW
let gameData = {
  gameBoard: [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
  bluesTurn: true,
  winner: false,
  AIMove: false,
}

function onload() {
}

// These function affect globals ***
function reset() {
  gameData = {
    gameBoard: [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],
    bluesTurn: true,
    winner: false,
    AIMove: false
  }
  buildBoard();
  updateView(gameData.gameBoard);
}

function playSecond() {
  console.log('Playing Second');
  reset();
  opponentsTurn();
}

// UI FUNCTIONS
function buildBoard() {
  const playArea = document.getElementById("playArea");
  playArea.innerHTML = "";
  let col, square;
  for (let colNum=0; colNum<7; colNum++) {
    col = document.createElement('div');
    col.classList.add("column");
    col.setAttribute('onclick', 'columnClicked('+colNum+')')
    col.setAttribute('onmouseenter', 'highlightColumn(event, true)');
    col.setAttribute('onmouseleave', 'highlightColumn(event, false)');
    for(let row=0; row<6; row++) {
      square = document.createElement('div');
      square.classList.add("square");
      square.setAttribute("id", colNum+""+row)
      col.appendChild(square);
    }
    playArea.appendChild(col);
  }
}
function updateView(board) {
  for (let col=0; col<7; col++) {
    for (let row=0; row<6; row++) {
      if(board[col][row] == 1) {
        document.getElementById(col+""+row).classList.add("blue");
      } else if (board[col][row] == 2) {
        document.getElementById(col+""+row).classList.add("yellow");
      } else if (board[col][row] == 0) {
        document.getElementById(col+""+row).classList.remove("blue", "yellow");
      }
    }
  }
  document.getElementById("nextTurn").innerHTML = "Next Player: "+(gameData.bluesTurn?"Blue":"Yellow");
}
function highlightColumn(e, highlight) {
  if (highlight) {
    for (let square of e.target.children) {
      square.classList.add("highlighted");
    }
  } else {
    for (let square of e.target.children) {
      square.classList.remove("highlighted");
    }
  }
}
function hideHighlightedColumn() {
  for (let column of document.getElementById("playArea").children) {
    for (let square of column.children) {
      square.classList.add("unhighlighted");   
    }
  }
}
function showHighlightedColumn() {
  for (let column of document.getElementById("playArea").children) {
    for (let square of column.children) {
      square.classList.remove("unhighlighted");   
    }
  }
}
function showButtons(buttons) {
  for(let buttonId of buttons) {
    document.getElementById(buttonId).classList.remove("hidden");
  }
}
function hideButtons(buttons) {
  for(let buttonId of buttons) {
    document.getElementById(buttonId).classList.add("hidden");
  }
}
let thinkingState = 0; // Function Static
function updateThinking(state) {
  thinkingState = (thinkingState % 3) + 1;
  if (state != undefined) {
    thinkingState = state;
  }
  let thinkingArea = document.getElementById("thinkingArea");
  if (thinkingState == 0) {
    thinkingArea.innerHTML = "";
  } else if (thinkingState == 1) {
    thinkingArea.innerHTML = "Thinking.";
  } else if (thinkingState == 2) {
    thinkingArea.innerHTML = "Thinking..";
  } else if (thinkingState == 3) {
    thinkingArea.innerHTML = "Thinking...";
  }
}
function columnClicked(colNum) {
  console.log("Column Clicked")
  if (gameData.AIMove) {return;}

  placePiece(colNum);

  opponentsTurn();
}

async function opponentsTurn() {
  if (globals.gameMode === "human") {
    return;
  } else if (globals.gameMode === "minimax") {
    console.log("MINIMAX")
    // Hide Highlight
    gameData.AIMove = true
    hideHighlightedColumn();
    updateThinking(1);
  
    // Allow UI to update
    await sleep(1);

    // AI MOVE
    let colNum = await getActionByMinimax(gameData.bluesTurn, gameData.gameBoard, 8); // A depth of 8 is used here

    placePiece(colNum);

    //Show Highlight
    updateThinking(0);
    showHighlightedColumn();
    gameData.AIMove = false

  } else if (globals.gameMode === "q-tables") {
    // TODO
  }
}
function placePiece(colNum) {
  if (columnFull(gameData.gameBoard, colNum) || gameData.winner) {return;}
  gameData.gameBoard = placeInBoard(gameData.gameBoard, colNum, gameData.bluesTurn);
  gameData.bluesTurn = !gameData.bluesTurn;

  updateView(gameData.gameBoard);

  gameData.winner = checkForWin(gameData.gameBoard);
  if (gameData.winner != null) {
    document.getElementById("nextTurn").innerHTML = gameData.winner==1?"Winner: Blue!":(gameData.winner == 2? "Winner: Yellow!": "Tie Game!");
    updateThinking(0);
    return;
  }
}

// SYSTEM FUNCTIONS
function deepCopyMatrix(matrix) {
  let newMatrix = [];
  for (let i=0; i<matrix.length; i++) {
    if (matrix[i] instanceof Array) {
      newMatrix[i] = deepCopyMatrix(matrix[i]);
    } else {
      newMatrix[i] = matrix[i];
    }
  }
  return newMatrix;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// GAME FUNCTIONS
function placeInBoard(board, colNum, bluesTurn) {
  let newBoard = deepCopyMatrix(board);
  newBoard[colNum] = placeInColumn(newBoard[colNum], bluesTurn);
  return newBoard;
}
function placeInColumn(column, bluesTurn) {
  let newColumn = deepCopyMatrix(column);
  for(let row=5; row>=0; row--) {
    if (newColumn[row] == 0) {
      newColumn[row] = ( bluesTurn ? 1 : 2 );
      return newColumn;
    }
  }
}
function boardFull(board) {
  for (let col=0; col<7; col++) {
    if (board[col][0] == 0) {
      return false;
    }
  }
  return true;
}
function columnFull(board, colNum) {
  let column = board[colNum];
  for (let row=5; row>=0; row--) {
    if (column[row] == 0) {
      return false;
    }
  }
  return true;
}
function checkForWin(board) {
  // Fold
  if (boardFull(board)) {
    return 3;
  }
  let winner = null;
  for (let col=0; col<7; col++) {
    for (let row=0; row<6; row++) {
      // For each square
      if (board[col][row] != 0) {
        // has a piece (Check lines)
        if (row>2) {
          //ul
          if (col>2) {
            if (board[col][row] == board[col-1][row-1] && board[col][row] == board[col-2][row-2] && board[col][row] == board[col-3][row-3]) {
              return board[col][row];
            }
          }
          //u
          if (board[col][row] == board[col][row-1] && board[col][row] == board[col][row-2] && board[col][row] == board[col][row-3]) {
            return board[col][row];
          }
          //ur
          if (col<4) {
            if (board[col][row] == board[col+1][row-1] && board[col][row] == board[col+2][row-2] && board[col][row] == board[col+3][row-3]) {
              return board[col][row];
            }
          }
        }
        if (col>2) {
          //l
          if (board[col][row] == board[col-1][row] && board[col][row] == board[col-2][row] && board[col][row] == board[col-3][row]) {
            return board[col][row];
          }
        }
      }
    }
  }
  return null;
}

// MINIMAX FUNCTIONS
let callCount = 0;
function getRandomMax(results) {
  let max = Math.max(...results);
  let maximaMoves = [];
  for (let i=0; i<results.length;i++) {
    if (results[i] == max) {
      maximaMoves.push(i);
    }
  }
  return maximaMoves[Math.floor(Math.random()*maximaMoves.length)];
}
async function getActionByMinimax(bluesTurn, board, depth) {
  callCount=0;
  let results = [];
  let result;
  for (let colNum=0; colNum<7; colNum++) {
    if (columnFull(board, colNum)) { results.push(-Infinity); continue; };
    result = await minimax(placeInBoard(board, colNum, bluesTurn), depth, false, -Infinity, Infinity,  bluesTurn);
    results.push(result);
  }
  let action = getRandomMax(results);
  return action;
}
function getScoreForPosition(board, winner, bluesTurn, depthRemaining) {
  // Game not over with no depth remaining.
  if (depthRemaining == 0 && winner == null) {
    // Evaluate Board...
    // Evaluate the current position (Not a loss, not a win) as better than an immediate win and worse than a loss. (Neutral) i.E. 0
    return 0;
  }
  if ((winner == 1 && bluesTurn) || (winner == 2 && !bluesTurn)) {
    return 10 * (depthRemaining+1);
  } else if ((winner == 1 && !bluesTurn) || (winner == 2 && bluesTurn)) {
    return -10 * (depthRemaining+1);
  } else if (winner == 3) {
    return 1;
  } else {
    return -1;
  }
}
async function minimax(board, depth, maximizingPlayer, alpha, beta, bluesTurn) {
  callCount++;
  if (callCount % 10000 == 0) {
    if (callCount % 100000 == 0) {
      updateThinking();
    }
    await sleep(1);
  }

  let minEval, eval, maxEval;
  let winner = checkForWin(board);
  if (depth == 0 || winner != null) {
    return getScoreForPosition(board, winner, bluesTurn, depth);
  }
  if (maximizingPlayer) {
    maxEval = -Infinity;
    for (let colNum=0; colNum<7; colNum++) {
      if (columnFull(board, colNum)) {
        continue;
      } else {
        eval = await minimax(placeInBoard(board, colNum, bluesTurn), depth - 1, false, alpha, beta, bluesTurn);
      }
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    minEval = Infinity;
    for (let colNum=0; colNum<7; colNum++) {
      if (columnFull(board, colNum)) {
        continue;
      } else {
        eval = await minimax(placeInBoard(board, colNum, !bluesTurn), depth - 1, true, alpha, beta, bluesTurn);
      }
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}