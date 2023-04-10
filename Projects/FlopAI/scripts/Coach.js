class Coach {
  constructor() {
    this.trainingData = [];
    this.stopTraining = false;
  }

  add(inputs, outputs) {
    let item = new DataObject(inputs, outputs);
    this.trainingData.push(item);
  }

  assembleAllTrainingData() {
    let count = 0;
    for(let map of mapManager.maps) {
      if (count == 6) { return; }
      count++;
      this.assembleTrainingDataFromMapArray(map.array);
    }
  }

  assembleTrainingDataFromMapArray(array) {
    // Just start with training on newLevel
    if (array == null) { console.log("Map not found... Data rapidly unassembled."); return; }
    array = array.slice();
    //for (map of mapManager.maps) {
      //array = map.array.slice();
      let decoder = new Decoder(array);
      let decodedPieces = decoder.fastDecode();
      if (decodedPieces == null) {
        alert("This map is unsolvable... Maybe don't.");
        return; // Change to continue later probably
      }
      console.log(decodedPieces);
      // Remove the player from the map.
      for (let row=0; row<array.length; row++) {
        for (let col=0; col<array[row].length;col++) {
          let playerIndex = array[row].indexOf(3);
          if (playerIndex > 0) {array[row][playerIndex] = 1;}
          let playerSecondIndex = array[row].indexOf(4);
          if (playerSecondIndex > 0) {array[row][playerSecondIndex] = 1;}
        }
      }
      let temp = 1;
      let temp2 = 1;
      // First do all standing
      for (let row=0; row<decodedPieces[0].length; row++) {
        for (let col=0; col<decodedPieces[0][row].length;col++) {
          // If piece has a route to goal. Place standing player in array. Add data to training data.
          if (decodedPieces[0][row][col] != null && !(decodedPieces[0][row][col] === "G")) {
            temp = array[row][col];
            array[row][col] = 3;
            this.trainingData.push(new Data(this.getInputsMatrixFromMapArray(array), decodedPieces[0][row][col]));
            array[row][col] = temp;
          }
        }
      }

      // All Leaning North
      for (let row=0; row<decodedPieces[1].length; row++) {
        for (let col=0; col<decodedPieces[1][row].length;col++) {
          // If piece has a route to goal. Place standing player in array. Add data to training data. Remove Player again.
          if (decodedPieces[1][row][col] != null && !(decodedPieces[1][row][col] === "G")) {
            temp = array[row][col];
            temp2 = array[row-1][col];
            array[row][col] = 3;
            array[row-1][col] = 4;
            this.trainingData.push(new Data(this.getInputsMatrixFromMapArray(array), decodedPieces[1][row][col]));
            array[row][col] = temp;
            array[row-1][col] = temp2;
          }
        }
      }
      // All Leaning West
      for (let row=0; row<decodedPieces[2].length; row++) {
        for (let col=0; col<decodedPieces[2][row].length;col++) {
          // If piece has a route to goal. Place standing player in array. Add data to training data.
          if (decodedPieces[2][row][col] != null && !(decodedPieces[2][row][col] === "G")) {
            temp = array[row][col];
            temp2 = array[row][col-1];
            array[row][col] = 3;
            array[row][col-1] = 4;
            this.trainingData.push(new Data(this.getInputsMatrixFromMapArray(array), decodedPieces[2][row][col]));
            array[row][col] = temp;
            array[row][col-1] = temp2;
          }
        }
      }

  //  }
  }

  getInputsMatrixFromMapArray(array) {
    let inputs = new Matrix(100,1);
    for (let row=0;row<10;row++) {
      for (let col=0;col<10;col++) {
        inputs.setVal(row*10+col,0,Brain.translateMapValue(array[row][col]));
      }
    }
    return inputs;
  }

  train() {
    this.stopTraining = false;
    //Shuffle Training Data
    let array = this.trainingData.slice();
    //console.log(array);
    //Train AI over all data a bunch of times
    for (let i=0; i<200; i++) {
      if (this.stopTraining == true) {
        console.log("Training Interrupted!");
        break;
      }
      if (i % 10 == 0) {
        console.log("Starting Epoch "+(i/10+1)+"...");
      }
      System.hardShuffleArray(array);
      let randSubject = System.getRandInt(0, array.length-1);
      for (let data of array) {
        ai.brain.nn.train(data.inputs.getCopy(), data.targets.getCopy());
      }
    }
    //DONE! :)
  }

  stopTraining() {
    this.stopTraining = true;
  }

  runTestTrain() {
    console.log("Assebling Data");
    this.assembleTrainingData();
    console.log("Data Assembled");
    console.log(this.trainingData);
    console.log("Training...");
    this.train();
    console.log("Successfully Trained the Neural Network!");
  }







}

class Data {
  constructor(inputsMatrix, outputDirection) {
    let targets = null;
    if (outputDirection === "N") {
      targets = new Matrix([[1],[0],[0],[0]]);
    } else if (outputDirection === "E") {
      targets = new Matrix([[0],[1],[0],[0]]);
    } else if (outputDirection === "S") {
      targets = new Matrix([[0],[0],[1],[0]]);
    } else if (outputDirection === "W") {
      targets = new Matrix([[0],[0],[0],[1]]);
    } else {
      alert("ERROR!");
      console.log("ERROR!");
    }
    this.inputs = inputsMatrix;
    this.targets = targets;
  }
}
