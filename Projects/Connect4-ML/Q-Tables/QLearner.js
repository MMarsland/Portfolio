class QLearner {
  constructor(learningRate, discountFactor, explortationRate) {
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.explortationRate = explortationRate;
    this.qTable = {};
    this.lastStateHash;
    this.lastAction;
  }

  addNewState(stateHash) {
    this.qTable[stateHash] = [0,0,0,0,0,0,0];
  }
}
