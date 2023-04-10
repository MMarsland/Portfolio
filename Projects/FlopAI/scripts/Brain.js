
let nn = new NeuralNetwork(1,10,10,1);
class Brain {
  constructor() {
    // Gonna Start with 100 inputs, 20, 4 Outputs
    this.name = "";
    this.traits = "";
    this.nn = new NeuralNetwork(100,8,7,6,5,4);
    this.randomizeBrain();
  }
  // New Neural Network Functions
  randomizeBrain(){
    this.name = System.getRandomName();
    this.traits = System.getRandomTraitsText();
    this.nn = new NeuralNetwork(100,36,12,4);
    console.log("Brain Randomized");
  }

  static show() {
    console.log("Successfully Trained:");
    console.log("Input: [0.1505] => Result: [0.345] == "+ nn.feedForward(new Matrix([[0.1505]])).toString());
    console.log("Input: [0.212] => Result: [0.103] == "+ nn.feedForward(new Matrix([[0.212]])).toString());
    console.log("Input: [0.420] => Result: [0.69] == "+ nn.feedForward(new Matrix([[0.420]])).toString());
    console.log("Input: [0.8] => Result: [0.1] == "+ nn.feedForward(new Matrix([[0.8]])).toString());
    console.log("GUESS:")
    console.log("Input: [0.3] => Result: [??] == "+ nn.feedForward(new Matrix([[0.3]])).toString());
  }

  getMove() {
    let results = this.nn.feedForward(Brain.getInputsMatrix()).to1DArray();
    console.log(results);
    return Brain.getDirection(results);
  }

  static getInputsMatrix() {
    //Gets an array that represents the current map state (from the map UI)
    let mapArray = mapManager.getMapArray();
    let inputs = new Matrix(100,1);
    for (let row=0;row<10;row++) {
      for (let col=0;col<10;col++) {
        inputs.setVal(row*10+col,0,Brain.translateMapValue(mapArray[row][col]));
      }
    }
    console.log("InputsMatrix:");
    console.log(inputs);
    return inputs;
  }

  static translateMapValue(mapVal) {
    switch (mapVal) {
      case 1:
        return 0.2;
      case 2:
        return 0.4;
      case 3:
        return 0.8;
      case 4:
        return 0.6;
      default:
        return 0;
    }
  }

  static getDirection(outputs) {
    let max = Math.max(...outputs);
    let index = outputs.indexOf(max);
    if (index == 0) {
      return "N";
    } else if (index == 1) {
      return "E";
    } else if (index == 2) {
      return "S";
    } else if (index == 3) {
      return "W";
    } else {
      alert("ERROR (Index)");
    }
  }

  //Upload and Download Functions
  encodeBrain(text) {
    let brainText = text.substring(text.indexOf("Brain:"));
    let nameText = brainText.substring(brainText.indexOf("Name:"));
    this.name = nameText.substring(6, nameText.indexOf("\n"));
    let traitsText = brainText.substring(brainText.indexOf("Traits:"));
    this.traits = traitsText.substring(8, traitsText.indexOf("\n"));
    let neuronText = brainText.substring(brainText.indexOf("Neurons:"));
    let neuronString = neuronText.substring(neuronText.indexOf("[")+1, neuronText.indexOf("]"));
    let wiringsText = brainText.substring(brainText.indexOf("Wirings:"));
    let wiringsString = wiringsText.substring(wiringsText.indexOf("[")+1, wiringsText.indexOf("]"));
    //Add Neurons to Col1
    let neuronVals = neuronString.split(",");
    for (let i=0;i<neuronVals.length;i++){
      this.biases[i] = neuronVals[i];
    }
    let wiringsVals = wiringsString.split(",");
    for (let i=0;i<wiringsVals.length;i++){
      this.wirings[i] = wiringsVals[i];
    }
    console.log("Brain Uploaded");
  }

  getBrainText() {
    let text = System.getTabbedText(0, "Brain:");
    text += System.getTabbedText(0, "{");
    text += System.getTabbedText(1, "Name: '"+this.name+"'");
    text += System.getTabbedText(1, "Traits: '"+this.traits+"'");
    text += System.getTabbedText(1, this.nn.getNNText());
    text += System.getTabbedText(0, "}", true);
    return text;
  }







  //Old Neural Functions
  /*
  randomizeBrain(){
    let numWirings = 100 * 8 + 8 * 4;
    let numbiases = 8 + 4;
    for (let i = 0; i<numWirings;i++) {
      this.wirings[i] = System.getRandNormal();
    }
    for (let i=0;i<numbiases;i++) {
      this.biases[i] = 0;//getRandNormal();
    }
    this.name = System.getRandomName();
    this.traits = System.getRandomTraitsText();
    console.log("Brain Randomized");
  }

  getBrainText() {
    let text = "Brain:\n";
    text += "Name: "+this.name+"\n";
    text += "Traits: "+this.traits+"\n";
    text += "Neurons:\n[";
    for (let i=0; i<this.biases.length;i++){
      text += this.biases[i] + "";
      text += (i == this.biases.length-1)? "]\n" : ",";
    }
    text += "Wirings:\n[";
    for (let i=0; i<this.wirings.length;i++){
      text += this.wirings[i] + "";
      text += (i == this.wirings.length-1)? "]\n" : ",";
    }
    return text;
  }

  encodeBrain(text) {
    let brainText = text.substring(text.indexOf("Brain:"));
    let nameText = brainText.substring(brainText.indexOf("Name:"));
    this.name = nameText.substring(6, nameText.indexOf("\n"));
    let traitsText = brainText.substring(brainText.indexOf("Traits:"));
    this.traits = traitsText.substring(8, traitsText.indexOf("\n"));
    let neuronText = brainText.substring(brainText.indexOf("Neurons:"));
    let neuronString = neuronText.substring(neuronText.indexOf("[")+1, neuronText.indexOf("]"));
    let wiringsText = brainText.substring(brainText.indexOf("Wirings:"));
    let wiringsString = wiringsText.substring(wiringsText.indexOf("[")+1, wiringsText.indexOf("]"));
    //Add Neurons to Col1
    let neuronVals = neuronString.split(",");
    for (let i=0;i<neuronVals.length;i++){
      this.biases[i] = neuronVals[i];
    }
    let wiringsVals = wiringsString.split(",");
    for (let i=0;i<wiringsVals.length;i++){
      this.wirings[i] = wiringsVals[i];
    }
    console.log("Brain Uploaded");
  }

  getOutputs(inputs) {
    // Input length = 100
    // Create Wirings Matrix
    // 100 by 8
    let firstWiringsMatrix = [];
    for (let i=0;i<8;i++) {
      firstWiringsMatrix[i] = [];
    }
    for (let i=0;i<8;i++) {
      for (let j=0;j<100;j++) {
        firstWiringsMatrix[i][j] = this.wirings[(i*100+j)];
      }
    }

    //console.log("firstWiringsMatrix:");
    //console.log(firstWiringsMatrix);

    let inputMatrix = [];
    // Create Inputs Matrix
    for (let i=0; i<100; i++){
      inputMatrix[i] = sigmoid(inputs[i]);
    }

    //Create Bias Matrix
    let firstBiasMatrix = [];
    // Create Inputs Matrix
    for (let i=0; i<8; i++){
      firstBiasMatrix[i] = this.biases[i];
    }
    //console.log("firstBiasMatrix:");
    //console.log(firstBiasMatrix);
    // Calculate hidden layer 1 values
    let hiddenLayer1Matrix = [];
    hiddenLayer1Matrix = sigmoidMatrix(addMatrices(sigmoidMatrix(multiplyMatrices(firstWiringsMatrix, inputMatrix)), firstBiasMatrix));
    console.log("hiddenLayer1Matrix:");
    console.log(hiddenLayer1Matrix);
    console.log("First Value:");
    let firstVal = 0;
    for (let i=0; i<100;i++){
      firstVal += inputs[i]*firstWiringsMatrix[0][i];
    }
    firstVal += firstBiasMatrix[0];
    console.log(tanh(firstVal));
    // Calculate Output layer
    // Find Second Wirings and Second Bias Matrices
    let secondWiringsMatrix = [];
    for (let i=0;i<4;i++) {
      secondWiringsMatrix[i] = [];
    }
    for (let i=0;i<4;i++) {
      for (let j=0;j<8;j++) {
        secondWiringsMatrix[i][j] = this.wirings[(800 + (i*8+j))];
      }
    }
    console.log("secondWiringsMatrix:");
    console.log(secondWiringsMatrix);

    //Create Bias Matrix
    let secondBiasMatrix = [];
    // Create Inputs Matrix
    for (let i=0; i<4; i++){
      secondBiasMatrix[i] = this.biases[(8 + i)];
    }
    console.log("secondBiasMatrix:");
    console.log(secondBiasMatrix);
    // Calculate output layer values
    let outputMatrix = [];
    outputMatrix = sigmoidMatrix(addMatrices(sigmoidMatrix(multiplyMatrices(secondWiringsMatrix, hiddenLayer1Matrix)), secondBiasMatrix));
    console.log("outputMatrix:");
    console.log(outputMatrix);
    console.log(Math.max(...outputMatrix));
    //find Direction
    return outputMatrix;
  }

  getMove(outputs) {
    let max = Math.max(...outputs);
    let index = outputs.indexOf(max);
    if (index == 0) {
      return "N";
    } else if (index == 1) {
      return "E";
    } else if (index == 2) {
      return "S";
    } else if (index == 3) {
      return "W";
    } else {
      alert("ERROR (Index)");
    }
  }

  getInputs() {
    let mapArray = mapManager.getMapArray();
    let inputsMatrix = [];
    for (let i=0;i<10;i++) {
      for (let j=0;j<10;j++) {
        inputsMatrix[(i*10+j)] = translateMapValue(mapArray[i][j]);
      }
    }
    console.log("InputsMatrix:");
    console.log(inputsMatrix);
    return inputsMatrix;
  }

  translateMapValue(mapVal) {
    switch (mapVal) {
      case 1:
        return 0.2;
      case 2:
        return 0.4;
      case 3:
        return 0.8;
      case 4:
        return 0.6;
      default:
        return 0;
    }
  }
  */
}
