class NeuralNetwork {
  constructor(...args) {
    //Arguments in the form (#inputs, #1st hidden layer nodes, #2nd hidden layer nodes, outputs)

    this.weights = [];
    this.biases = [];
    let numArgs = args.length;
    if (numArgs < 2) { throw new Error("Not enough Args!")}

    for (let i=0; i<numArgs-1;i++) {
      this.weights.push(new Matrix(args[i+1], args[i]));
      this.biases.push(new Matrix(args[i+1], 1));
      this.weights[i].randomize();
      this.biases[i].zero();
    }

    this.hidden_layers = numArgs-2;
    this.learning_rate = 0.1;
  }

  feedForward(inputs) {
    if (!(inputs instanceof Matrix)) {
      inputs = new Matrix(inputs);
    }

    let weights;
    let bias;
    let layers = [inputs];
    for (let i=0;i<this.hidden_layers+1;i++) {
      weights = this.weights[i].getCopy();
      bias = this.biases[i].getCopy();
      layers.push(weights.getMultiply(layers[i]));
      layers[i+1].add(bias);
      layers[i+1].map(System.sigmoid);
    }

    return layers[layers.length-1];
  }

  train(inputs, targets) {
    if (!(inputs instanceof Matrix)) {
      inputs = new Matrix(inputs);
    }
    if (!(targets instanceof Matrix)) {
      targets = new Matrix(targets);
    }

    // Feed Forward
    let weights;
    let bias;
    let layers = [inputs];
    for (let i=0;i<this.hidden_layers+1;i++) {
      weights = this.weights[i].getCopy();
      bias = this.biases[i].getCopy();
      layers.push(weights.getMultiply(layers[i]));
      layers[i+1].add(bias);
      layers[i+1].map(System.sigmoid);
    }

    // Back Propagation
    // Errors
    let errors = [];
    errors[layers.length-1] = targets.subtract(layers[layers.length-1]);
    let transpose;
    for (let i=layers.length-2;i>0;i--) {
      transpose = this.weights[i].getTranspose();
      errors[i] = transpose.getMultiply(errors[i+1]);
    }
    //Get Gradients & Make Changes
    let gradient;
    let delta;
    for (let i=0; i<layers.length-1;i++) {
      gradient = layers[i+1].getCopy();
      gradient.map(System.dsigmoid);
      gradient.dot(errors[i+1]);
      gradient.scalar(this.learning_rate);
      transpose = layers[i].getTranspose();
      delta = gradient.getMultiply(transpose);
      this.weights[i].add(delta);
      this.biases[i].add(gradient);
    }
  }

  setLearningRate(value) {
    this.learning_rate = value;
  }

  getNNText() {
    let text = System.getTabbedText(0, "Neural Network:");
    text += System.getTabbedText(0, "{");
    // Hidden layers
    text += System.getTabbedText(1, "Hidden Layers: '" + this.hidden_layers+"'");
    // Learning Rate
    text += System.getTabbedText(1, "Learning Rate: '" + this.learning_rate+"'");
    // Weights
    text += System.getTabbedText(1, this.getWeightsText());
    // Biases
    text += System.getTabbedText(1, this.getBiasesText());
    text += System.getTabbedText(0, "}", true);
    return text;
  }

  getWeightsText() {
    let text = System.getTabbedText(0, "Weights:\n{");
    let weightsText = "";
    for (let layer=1; layer<=this.hidden_layers; layer++) {
      weightsText += System.getTabbedText(0, "Layer " + layer +":\n{");
      weightsText += System.getTabbedText(1, this.weights[layer].toString());
      weightsText += System.getTabbedText(0, "}");
    }
    weightsText = weightsText.substring(0, weightsText.length - 2);
    text += System.getTabbedText(1, weightsText);
    text += System.getTabbedText(0, "}", true);
    return text;
  }

  getBiasesText() {
    let text = System.getTabbedText(0, "Biases:\n{");
    let biasesText = "";
    for (let layer=1; layer<=this.hidden_layers; layer++) {
      biasesText += System.getTabbedText(0, "Layer " + layer +":\n{");
      biasesText += System.getTabbedText(1, this.biases[layer].toString());
      biasesText += System.getTabbedText(0, "}");
    }
    biasesText = biasesText.substring(0, biasesText.length - 2);
    text += System.getTabbedText(1, biasesText);
    text += System.getTabbedText(0, "}", true);
    return text;
  }
}
