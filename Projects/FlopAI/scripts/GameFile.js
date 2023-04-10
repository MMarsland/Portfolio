class GameFile {
  constructor(gameFileText) {
    this.parseGameFile(gameFileText);
    this.name;
    this.mapsText;
    this.brainText;
  }

  parseGameFile(text) {

  }
}

class MapsText {
  constructor(mapsText) {
    this.parseMapsText(mapsText);
    this.mapText = [];
  }
}

class brainText {
  constructor(brainText) {
    this.parseBrainText(brainText);
    this.name;
    this.traits;
    this.neauralNetworkText;
  }
}

class NeauralNetworkText {
  constructor(brainText) {
    this.parseBrainText(brainText);
    this.hiddenLayers;
    this.learningRate;
    this.weightsText;
    this.BiasesText;
  }
}

class weightsText {
  constructor(weightsText) {
    this.parseweightsText(weightsText);
    this.layers = [];
  }
}

class biasesText {
  constructor(biasesText) {
    this.parsebiasesText(biasesText);
    this.layers = [];
  }
}
