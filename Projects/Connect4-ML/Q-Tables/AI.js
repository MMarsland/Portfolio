    // BOARD IS COL-ROW
    let gameBoard = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
    let blueTurn = true;
    let player1 = new QLearner(0.1, 0.1, 0.1);
    let player2 = new QLearner(0.1, 0.1, 0.1);
    let userGameStats = {
      userPlaying: false,
      round: 0,
      winner: null,
    }

    // Test
    function test() {
      let board = deepCopyArray(gameBoard);
      board[3][4] = 1;
      board[3][5] = 1;
      board[3][0] = 1;
      board[1][4] = 2;
      board[2][3] = 1;
      board[6][0] = 0;
      console.log(board);
      let hashValue = hash(board);
      console.log(hashValue);
      let state = unHash(hashValue);
      console.log(state);
    }
    // END


    // UI functions
    function onload() {
      buildBoard();
    }

    function buildBoard() {
      const playArea = document.getElementById("playArea");
      playArea.innerHTML = "";
      let col, square;
      for (let colNum=0; colNum<7; colNum++) {
        col = document.createElement('div');
        col.classList.add("column");
        col.setAttribute('onclick', 'columnClicked('+colNum+')')
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
      document.getElementById("nextTurn").innerHTML = "Next Player: "+(blueTurn?"Blue":"Yellow");
    }

    function updateViewToGameBoard() {
      updateView(gameBoard);
    }

    function consoleLogBoard(board) {
      // Rotate the board!
      let boardToLog = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
      for (let col=0;col<7;col++) {
        for (let row=0; row<6; row++) {
          boardToLog[row][col] = board[col][row];
        }
      }
      console.log(boardToLog);
    }
    // END

    function playAgainstAI() {
      reset();
      updateViewToGameBoard();
      userGameStats.userPlaying = true;
      userGameStats.round = 0;
      userGameStats.winner = null;
    }

/*
    function columnClicked(colNum) {
      if (!userGameStats.userPlaying) {return;}
      userGameStats.round++;
      gameBoard = placeInBoard(gameBoard, colNum);
      blueTurn = !blueTurn;

      updateViewToGameBoard();

      //TrainPlayer2
      if (userGameStats.round > 1) {
          update(player2, player2State, player2StateRewards, player2ChosenAction, gameBoard);
      }

      userGameStats.winner = checkForWin(gameBoard);
      if (userGameStats.winner != null) {
        userGameStats.userPlaying = false;
        console.log("Game Over");
        document.getElementById("nextTurn").innerHTML = userGameStats.winner==1?"Winner: Blue!":(userGameStats.winner == 2? "Winner: Yellow!": "Tie Game!");
        return;
      }

      // AI MOVE
      // Agent1 Guess Move
      [player2State, player2StateRewards, player2ChosenAction] = makeMove(player2, gameBoard);

      updateViewToGameBoard();

      console.log(`ROUND ${userGameStats.round}: Player2 placing in column ${player2ChosenAction}`);
      console.log(`Rewards vector was: ${player2StateRewards.map(x => x.toFixed(2))}`);
      userGameStats.winner = checkForWin(gameBoard);
      if (userGameStats.winner != null) {
        userGameStats.userPlaying = false;
        update(player2, player2State, player2StateRewards, player2ChosenAction, gameBoard);
        console.log("Game Over");
        document.getElementById("nextTurn").innerHTML = userGameStats.winner==1?"Winner: Blue!":(userGameStats.winner == 2 ? "Winner: Yellow!" : "Tie Game!");
      }
    }
*/



    // Helper Functions
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandInt(min, max) {
        let realMax = max+1;
        let random = (Math.floor(Math.random() * (realMax-min)) + min);
        return random;
    }

    function deepCopyArray(array) {
      let newArray = [];
      for (let i=0; i<array.length; i++) {
        if (array[i] instanceof Array) {
          newArray[i] = deepCopyArray(array[i]);
        } else {
          newArray[i] = array[i];
        }
      }
      return newArray;
    }

    function fillArray(array, value) {
      let newArray = deepCopyArray(array);
      for (let i=0;i<array.length;i++) {
        newArray[i] = value;
      }
      return value;
    }

    function getIndexesOfMaxima(array) {
      let max = Math.max(...array);
      let indexes = [];
      for (i=0;i<array.length;i++) {
        if (array[i] == max) {
          indexes.push(i);
        }
      }
      return indexes;
    }
    // END







    // GAME FUNCTIONS

    //Resets the GAME
    function reset() {
      blueTurn = true;
      gameBoard = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
    }

    // Returns new board
    function placeInBoard(board, colNum) {
      let newBoard = deepCopyArray(board);
      newBoard[colNum] = placeInColumn(newBoard[colNum]);
      return newBoard;
    }

    // PRIVATE returns new column
    function placeInColumn(column) {
      let newColumn = deepCopyArray(column);
      for(let row=5; row>=0; row--) {
        if (newColumn[row] == 0) {
          newColumn[row] = ( blueTurn ? 1 : 2 );
          return newColumn;
        }
      }
    }

    // returns boolean
    function columnFull(board, colNum) {
      let column = board[colNum];
      for (let row=5; row>=0; row--) {
        if (column[row] == 0) {
          return false;
        }
      }
      return true;
    }

    function boardFull(board) {
      for (let col=0; col<7; col++) {
        if (board[col][0] == 0) {
          return false;
        }
      }
      return true;
    }

    // returns integer (1 or 2) or null
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
    //END



    // Q-Learning Functions

    //Run Train
    async function runTrain() {
      userPlaying = false;
      let times = document.getElementById("timesInput").value;
      let view = document.getElementById("view").checked;
      player1.lastStateHash = undefined;
      player1.lastAction = undefined;
      player2.lastStateHash = undefined;
      player2.lastAction = undefined;

      console.log(`Train called with times==${times} and view==${view}`);
      let startTime = new Date();
      await train(times, view);
      let endTime = new Date();
      let timeDiff = endTime - startTime; //in ms
      console.log(`Completed training in ${timeDiff/1000} seconds`);
    }

    // Train
    async function train(times, view) {

      for (let i=0; i<times; i++) {
        reset();

        if (view) { updateViewToGameBoard(); console.log(`Starting Game ${i+1}`); }

        // Run a game
        round = 1;
        //Player1 move (to start game)
        //Original State
        player1Action = getAction(player1, gameBoard);
        makeMove(player1, gameBoard, player1Action);

        if (view) {
          updateViewToGameBoard();
          console.log(`ROUND ${round}: Player1 placing in column ${player1Action}`);
          await sleep(500);
        }

        //LOOP
        while(checkForWin(gameBoard) == null) {

          //player2
          player2Action = getAction(player2, gameBoard);
          makeMove(player2, gameBoard, player2Action);
          if (view) {
            updateViewToGameBoard();
            console.log(`ROUND ${round}: Player2 placing in column ${player2Action}`);
            await sleep(500);
          }

          //TrainPlayer1
          update(player1, gameBoard);

          if (checkForWin(gameBoard) != null) {
            update(player2, gameBoard);
            break;
          }
          round++;

          //player1
          player1Action = getAction(player1, gameBoard);
          makeMove(player1, gameBoard, player1Action);
          if (view) {
            updateViewToGameBoard();
            console.log(`ROUND ${round}: Player1 placing in column ${player1Action}`);
            await sleep(500);
          }

          //TrainPlayer2
          update(player2, gameBoard);

          if (checkForWin(gameBoard) != null) {
            update(player1, gameBoard);
            break;
          }
        }
      }
    }


    // Make MOVE
    function makeMove(player, board, action) {
      //HIDE
      gameBoard = placeInBoard(board, action);
      blueTurn = !blueTurn;
    }

    // Get ACTION
    function getAction(player, state) {
        let stateHash = hash(state);
        let rewards = player.qTable[stateHash];
        let action;
        if (rewards && getRandInt(0,10) > player.explortationRate * 10) {
          // Exists and not random
          for (let col=0; col<7; col++) {
            if (columnFull(state, col)) {
              rewards[col] = -1;
            }
            // Otherwise leave it as is
          }

          // Check for equal maxima and randomly select
          let indexesOfMaxima = getIndexesOfMaxima(rewards);
          action = indexesOfMaxima[getRandInt(0,indexesOfMaxima.length-1)];

        } else {
          //Random ACTION && create state
          action = getRandInt(0,6);
          while(columnFull(state, action)) {
            action = getRandInt(0,6);
          }
          if (!rewards) {
            player.qTable[stateHash] = [0, 0, 0, 0, 0, 0, 0];
          }
          //player.qTable[stateHash][action] = 0; // todo WHAT IS THIS?

        }

        player.lastStateHash = stateHash;
        player.lastAction = action;
        return action
    }

    // Get reward
    function getRewards(player, stateHash) {
      let rewards = player.qTable[stateHash];
      if (!rewards) {rewards = [0, 0, 0, 0, 0, 0, 0];}

      let board = unHash(stateHash);
      let winner = checkForWin(board);
      if (winner != null) {
        if (winner == 3) {
          return [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
        } else if ((winner == 1 && player == player1) || (winner == 2 && player == player2)) {
          return [1,1,1,1,1,1,1];
        } else {
          return [-1,-1,-1,-1,-1,-1,-1];
        }
      }

      for (let col=0; col<7; col++) {
        if (columnFull(board, col)) {
          rewards[col] = -1;
        }
        // Otherwise leave it as is
      }

      return rewards;
    }


    // UPDATE
    function update(player, nextState) {
      let nextStateHash = hash(nextState);
      let modificationValue;
      let rewards = getRewards(player, player.lastStateHash);
      let nextStateRewards = getRewards(player, nextStateHash);

      if (nextStateRewards) {
        // reward == (player.qTable[stateHash][action] (and environment cases));
        let lr = player.learningRate;
        //console.log("lr:" + lr);
        let reward = rewards[player.lastAction];
        //console.log("reward:" + reward);
        let df = player.discountFactor;
        //console.log("df:" + df);
        let maxRewardOfNext = Math.max(...nextStateRewards);
        //console.log("maxRewardOfNext:" + maxRewardOfNext);
        let rewardBasic = player.qTable[player.lastStateHash][player.lastAction];
        //console.log("rewardBasic:" + rewardBasic);
        modificationValue = (lr * (reward + (df * maxRewardOfNext) - rewardBasic)).toFixed(4);
      } else {
        modificationValue = 0;
      }
      //console.log("Mod Value was: " + modificationValue)
      player.qTable[player.lastStateHash][player.lastAction] += modificationValue;
    }

    // HASH
    function hash(state) {
      let hash = "";
      for (let col=0;col<7;col++) {
        for (let row=0;row<6;row++) {
          hash += state[col][row];
        }
      }
      return hash;
    }

    // UNHASH
    function unHash(stateHash) {
      let board = [[],[],[],[],[],[],[]];
      let rowNum = 0;
      let colNum = 0;
      for (let i=0; i<stateHash.length; i++) {
        board[Math.floor(i/6)].push(parseInt(stateHash[i]));
      }
      return board;
    }

    // END
    /*
    // MINIMAX FUNCTIONS
    function getActionByMinimax(player, state) {
      return minimax(true, state, 4)[1];
    }

    function getScoreForPosition(board, winner, player) {
      if (!winner) {
        winner = checkForWin(board);
      }

      if ((winner == 1 && player == 1) || (winner == 2 && player == 2)) {
        console.log("win!")
        return 10;
      } else if ((winner == 1 && player == 2) || (winner == 2 && player == 1)) {
        console.log("Loss")
        return -10;
      } else if (winner == 3) {
        console.log("tie");
        return 0;
      } else {
        console.log("other");
        return 0;
      }
    }

    function minimax(position, depth, alpha, beta, maximizingPlayer, player) {
      let minEval, eval, maxEval;
      let winner = checkForWin(position);
      if (depth == 0 || winner != null) {
        console.log("Depth clock out for player "+ player +" with winner == "+ winner);
        return getScoreForPosition(position, winner, player);
      }

      if (maximizingPlayer) {
          maxEval = -Infinity;
          for (let col=0; col<7; col++) {
            if (columnFull(position, col)) {
              eval = -11;
            } else {
              temp = minimax(placeInBoardByPlayer(position, col, player), depth - 1, alpha, beta, false, (player==1?2:1));
              console.log(temp);
              eval = temp;
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
        for (let col=0; col<7; col++) {
          if (columnFull(position, col)) {
            eval = 11;
          } else {
            temp = minimax(placeInBoardByPlayer(position, col, player), depth - 1, alpha, beta, true, (player==1?2:1));
            console.log(temp);
            eval = temp;
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

        // initial call
    function testMinimax() {
      let board = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,1],[0,0,0,0,2,1],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
      let results = [];
      for (let col=0; col<7; col++) {
        results.push(minimax(placeInBoardByPlayer(board, col, 2), 10, -Infinity, Infinity, true, 2));
      }
      console.log(results);
      let action = results.indexOf(Math.max(...results));
      console.log("The best move is column: "+ action);
    }


    function placeInBoardByPlayer(board, colNum, player) {
      console.log(player);
      if (player == 1) {
        blueTurn = true;
      } else {
        blueTurn = false;
      }
      return placeInBoard(board, colNum);
    }
    // END
    */
    /*
    // NN Training Functions (Q-Learning Functions)
    async function runTrain() {
      userPlaying = false;
      let times = document.getElementById("timesInput").value;
      let view = document.getElementById("view").checked;

      console.log(`Train called with times==${times} and view==${view}`);
      let startTime = new Date();
      await train(times, view);
      let endTime = new Date();
      let timeDiff = endTime - startTime; //in ms
      console.log(`Completed training in ${timeDiff/1000} seconds`);
    }

    async function train(times, view) {

      for (let i=0; i<times; i++) {
        reset();

        if (view) { updateViewToGameBoard(); console.log(`Starting Game ${i+1}`); }

        // Run a game
        round = 1;
        //Player1 move (to start game)
        //Original State
        [player1State, player1StateRewards, player1ChosenAction] = makeMove(player1, gameBoard);
        if (view) {
          updateViewToGameBoard();
          console.log(`ROUND ${round}: Player1 placing in column ${player1ChosenAction}`);
          console.log(`Rewards vector was: ${player1StateRewards.map(x => x.toFixed(2))}`);
          await sleep(500);
        }

        while(checkForWin(gameBoard) == null) {

          //player2
          [player2State, player2StateRewards, player2ChosenAction] = makeMove(player2, gameBoard);
          if (view) {
            updateViewToGameBoard();
            console.log(`ROUND ${round}: Player2 placing in column ${player2ChosenAction}`);
            console.log(`Rewards vector was: ${player2StateRewards.map(x => x.toFixed(2))}`);
            await sleep(500);
          }
          //TrainPlayer1
          update(player1, player1State, player1StateRewards, player1ChosenAction, gameBoard);

          if (checkForWin(gameBoard) != null) {
            update(player2, player2State, player2StateRewards, player2ChosenAction, gameBoard);
            break;
          }
          round++;
          //player1
          [player1State, player1StateRewards, player1ChosenAction] = makeMove(player1, gameBoard);
          if (view) {
            updateViewToGameBoard();
            console.log(`ROUND ${round}: Player1 placing in column ${player1ChosenAction}`);
            console.log(`Rewards vector was: ${player1StateRewards.map(x => x.toFixed(2))}`);
            await sleep(500);
          }

          //TrainPlayer2
          update(player2, player2State, player2StateRewards, player2ChosenAction, gameBoard);

          if (checkForWin(gameBoard) != null) {
            update(player1, player1State, player1StateRewards, player1ChosenAction, gameBoard);
            break;
          }
        }
      }
    }

    function makeMove(player, board) {
      [stateRewards, action] = getRewardVectorAndAction(player, board);
      gameBoard = placeInBoard(board, action);
      blueTurn = !blueTurn;

      return [board, stateRewards, action];
    }

    // GET ACTION (EPISLON-RANDOM or MAX)
    function getRewardVectorAndAction(player, board) {
      let rewards = player.feedForward((new Matrix(board)).toColumnMatrix()).to1DArray();

      // Random epsolon % of the time
      if (player.epsilon * 10 >= getRandInt(1,10)) {
        let colNum = getRandInt(0,6);
        while(columnFull(board, colNum)) {
          colNum = getRandInt(0,6);
        }
        return [rewards, colNum];
      }



      // HELP THE WIN and avoid BREAKING THE GAME
      // If WIN return 1 in that vector position!
      for (let col=0; col<7; col++) {
        if (columnFull(board, col)) {
          rewards[col] = -1;
        } //else if (checkForWin(placeInBoard(board, col))) {
          //rewards[col] = 1;
        //}
        // Otherwise leave it as is
      }

      // Check for equals
      let indexesOfMaxima = getIndexesOfMaxima(rewards);
      action = indexesOfMaxima[getRandInt(0,indexesOfMaxima.length-1)];
      return [rewards, action];
    }

    // GET MAX REWARD
    // If Win (Max Reward, if theirs win, min reward, tie gives 0 and no win gives max of Q-function
    function getMaxReward(player, state) {
      let winner = checkForWin(state);
      if (winner != null) {
        if (winner == 3) {
          return 0;
        } else if ((winner == 1 && player == player1) || (winner == 2 && player == player2)) {
          return 10;
        } else {
          return -1;
        }
      }
      let inputs = (new Matrix(state)).toColumnMatrix();
      let results = player.feedForward(inputs).to1DArray()
      return Math.max(...results);
    }

    // UPDATE
    function update(player, originalState, originalStateRewards, chosenAction, nextState) {
      let targets = originalStateRewards;
      targets[chosenAction] = targets[chosenAction] + player.discount * getMaxReward(player, nextState);
      // Train on STATE and targets=(EXCPECTED with chosen col updated to be "reward + discount * MAX(expectedRewardsForNextState)"
      player.train(boardToInputs(originalState), Matrix.from1DArraytoColumnMatrix(targets));
    }

    function boardToInputs(board) {
      let transformedBoard = [];
      let value=0;
      for (let col=0; col<board.length; col++) {
        for (let row=0; row<board[0].length; row++) {
            if (board[col[row]] == 1) {
              value = 1;
            } else if (board[col[row]] == 2) {
              value = -1;
            } else {
              value = 0;
            }
            transformedBoard.push(value);
        }
      }
      return Matrix.from1DArraytoColumnMatrix(transformedBoard);
    }

    // END
    */
