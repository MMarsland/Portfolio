// --- GLOBALS ---
let holes = [[4,1], [7,2], [0,3], [4,3], [4,5], [5,7], [2,8], [7,8]];
let qMatrix =  [[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]];
let directionalDisplay = true;


// --- ONLOAD FUNCTION ---
function onload() {
  displayQTableRepresentation(qMatrix);
}


// --- TRAINING FUNCTIONS ---
function runTrain() {
  let times = document.getElementById("timesInput").value;
  train(times);
}

function train(times) {
  let cur_pos = [0,0];
  let path = [];

  for (let i=0; i<times; i++) {
    cur_pos = [0,0];

    // Run a game
    path = [];
    count = 0;
    while(!isGameOver(cur_pos) && count < 50) {
      count++;

      let action = (allEqual(qMatrix[cur_pos[1]][cur_pos[0]]))? randInt(0,3) : qMatrix[cur_pos[1]][cur_pos[0]].indexOf(Math.max(...qMatrix[cur_pos[1]][cur_pos[0]]));
      if (randInt(1,5) == 5) {
        action = randInt(0,3);
      }
      let next_state = getNextState(cur_pos, action);
      path.push([cur_pos, action]);
      cur_pos = next_state;
    }

    // Evaluate
    let score = evaluate(cur_pos);

    for (let i=0; i<path.length;i++) {
      let move = path[path.length-i-1];
      let orig = qMatrix[move[0][1]][move[0][0]][move[1]];
      let modifier = (0.8**i);
      let addition = score * modifier;
      qMatrix[move[0][1]][move[0][0]][move[1]] = orig + addition;
    }
  }

  displayQTableRepresentation(qMatrix);
}

function evaluate(cur_pos) {
  let envMatrix =  [[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                    [  0,  0,  0,  0,-10,  0,  0,  0,  0,  0],
                    [  0,  0,  0,  0,  0,  0,  0,-10,  0,  0],
                    [-10,  0,  0,  0,-10,  0,  0,  0,  0,  0],
                    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                    [  0,  0,  0,  0,-10,  0,  0, 20,  0,  0],
                    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                    [  0,  0,  0,  0,  0,-10,  0,  0,  0,  0],
                    [  0,  0,-10,  0,  0,  0,  0,-10,  0,  0],
                    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]];
  // if off board, return the same as a hole. May need to be adjusted
  if (cur_pos[0] == -1 || cur_pos[0] == 10 || cur_pos[1] == -1 || cur_pos[1] == 10) {
    return -10;
  }
  return envMatrix[cur_pos[1]][cur_pos[0]];
}

function reset() {
  qMatrix =  [[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
              [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]];
  displayQTableRepresentation(qMatrix);
}


// --- DISPLAY FUNCTIONS ---
function mapToColor(value) {

  let max = 1000;
  let min = -1000;
  if (value > max) {
    value = max;
  } else if (value < min) {
    value = min;
  }
  let percent = (value + 1000) / 2000;
  let greenVal = Math.round(255 * percent);
  let redVal = 255-greenVal;
  let greenHex = greenVal.toString(16);
  let redHex = redVal.toString(16);
  if (greenVal < 16) {
      greenHex = "0"+greenVal.toString(16);
  }
  if (redVal < 16) {
      redHex = "0"+redVal.toString(16);
  }
  return "#"+redHex+greenHex+"00";
}

function displayQTableRepresentation(qTable) {
  let colCount = -1;
  let rowCount = -1;
  let infoBox = document.getElementById("infoBox");
  infoBox.innerHTML = "";

  if (directionalDisplay){
     for (let row of qTable) {
      rowCount++;
      colCount = -1;
      for (let element of row) {
        colCount++;
        //let value = sumElement(element);
        //let color = mapToColor(value);
        let square = document.createElement("div");
        square.classList.add("square");
      
        if(rowCount == 0 && colCount == 0) {
          square.setAttribute("style","background: purple;");
        } else if (holes.some(obj => obj[1] == rowCount && obj[0] == colCount)) {
          square.setAttribute("style","background: black;");
        } else if (rowCount == 5 && colCount == 7) {
          square.setAttribute("style","background: gold;");
        } else {
          let triangles = [];
          let triangleDirections = ["top", "right", "bottom", "left"];
          for (let i=0;i<4;i++) {
            triangles.push(document.createElement("div"));
            triangles[i].classList.add("triangle-"+triangleDirections[i]);
            triangles[i].setAttribute("style","border-"+triangleDirections[(i+2)%4]+": 12.5px solid "+mapToColor(element[i]))
            triangles[i].setAttribute("title", "Q-Value: "+element[i]);
            square.appendChild(triangles[i]);
          }
          let arrowSymbol = getArrowDirectionSymbol(element);
          let arrow = document.createElement("div");
          arrow.classList.add("arrow");
          arrow.setAttribute("style","color: "+mapToColor(Math.max(...element)));
          arrow.innerHTML = arrowSymbol;
          square.appendChild(arrow);
        }
        infoBox.appendChild(square);
      }
    }

  } else {
    for (let row of qTable) {
      rowCount++;
      colCount = -1;
      for (let element of row) {
        colCount++;
        let value = sumElement(element);
        let color = mapToColor(value);
        let square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("title", "Q-Value Sum: "+value);
        if(rowCount == 0 && colCount == 0) {
          square.setAttribute("style","background: purple;");
        } else if (holes.some(obj => obj[1] == rowCount && obj[0] == colCount)) {
          square.setAttribute("style","background: black;");
        } else if (rowCount == 5 && colCount == 7) {
          square.setAttribute("style","background: gold;");
        } else {
          square.setAttribute("style","background: "+color+";");
        }
        infoBox.appendChild(square);
      }
    }
  }
}

function changeDisplay() {
  directionalDisplay = !directionalDisplay;
  displayQTableRepresentation(qMatrix);
}


// --- HELPER FUNCTIONS ---
function isGoalStateReached(cur_pos) {
  return isMatch(cur_pos, [7,5]);
}

function isMatch(array1,array2) {
  for (let i=0; i<array1.length;i++) {
    if(array1[i] != array2[i]) {
      return false;
    }
  }
  return true;
}

function getNextState(cur_pos, action) {
  // Allow the next state to be off the board. THis will be caught by the isGameOver function and the game will end before matrix access.
  if (action == 0) {
      return [cur_pos[0],(cur_pos[1]-1)]
  }
  else if (action == 1) {
    return [(cur_pos[0] + 1), cur_pos[1]];
  } else if (action == 2)
    return [cur_pos[0],(cur_pos[1] + 1)]
  else {
    return [(cur_pos[0] - 1), cur_pos[1]];
  }
}

function isGameOver(cur_pos) {
  // Check if off board
  if (cur_pos[0] == -1 || cur_pos[0] == 10 || cur_pos[1] == -1 || cur_pos[1] == 10) {
    return true;
  }
  if (isGoalStateReached(cur_pos)) {
    return true;
  }
  // Check in in hole
  for (let pos of holes) {
    if (isMatch(pos, cur_pos)) {
      return true;
    }
  }
  
  return false;
}

function allEqual(array) {
  let first = array[0];
  for (let value of array) {
    if (value != first) {
      return false;
    }
  }
  return true;
}

function randInt(min, max) {
  let realMax = max+1;
  let random = (Math.floor(Math.random() * (realMax-min)) + min);
  return random;
}

function sumElement(element) {
  let sum = 0;
  for (let val of element) {
    sum += val;
  }
  return sum;
}

function getArrowDirectionSymbol(element) {
  let maxIndex = element.indexOf(Math.max(...element));
  if (Math.abs(sumElement(element)) <= 100) {
    return "";
  }
  return ["&uarr;", "&rarr;", "&darr;", "&larr;"][maxIndex];
}
