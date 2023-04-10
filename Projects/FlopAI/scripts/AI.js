class AI {
  constructor() {
    this.brain = new Brain();
    this.running = false;
    this.decoder;
    this.decodedMapDirections;
  }

  async run() {
    // Also Words
    console.log("Starting the AI");
    //Loop AI forever (Until victory)

    //Decode the map! TEMP (Change the decoding system)
    //console.log("Decoding the map!");
    //this.decoder = new Decoder(mapManager.getMapArray());
    //this.decodedMapDirections = this.decoder.decode();
    this.running = true;
    while(this.running && app.view == "board") {
      // Decide On move
      let chosenMove = this.pickMove();
      // Make Move
      this.move(chosenMove);
      // Wait for the right time
      await System.sleep(100);
      // Repeat
    }
    this.running = false;
  }

  move(direction) {
    console.log("Moving: "+direction);
    switch(direction) {
      case "N":
        game.player.move("N");
        break;
      case "E":
        game.player.move("E");
        break;
      case "S":
        game.player.move("S");
        break;
      case "W":
        game.player.move("W");
        break;
      default:
        console.log("ERROR!");
        alert("ERROR!");
        break;
    }
  }

  pickMove() {
    let direction;
    // Words
    console.log("Selecting a move...");
    // Get Inputs
    // Use Nural Network to decide on move

    // Temporary (Just Move Randomly!)
    /*
    do {
      let moveInt = System.getRandInt(0,3);
      switch(moveInt) {
        case 0:
          direction = "N";
          break;
        case 1:
          direction = "E";
          break;
        case 2:
          direction = "S";
          break;
        case 3:
          direction = "W";
          break;
        default:
          console.log("ERROR!");
          alert("ERROR!");
          break;
      }
    } while (!this.decoder.isLegalMove(game.player.position.x, game.player.position.y, game.player.position.direction.getNumber(), direction));
    */

  //  if (this.cheatMode) {
      // TEMP 2: Use the Map Decoder to determine the best move based on current position!
      //direction = this.getBestNextDirection(game.player.position);
    //} else {
      // Real : use the Nural Network to pick a direction
      direction = this.brain.getMove();
  //  }

    // Return Move
    return direction;
  }

  async demoCheatMode() {
    //Visually decode
    // Work backwards from goal doing the animation
    this.decoder = new Decoder(mapManager.getMapArray());
    // FIND BEST PATH
    this.decodedMapDirections = await this.decoder.decode();
    // Run animation

    //Run Quick in cheat mode!

    //this.cheatMode = true;
    this.run();
  }

  runAnimation() {
    // Do selection Animation

    // Color in selected square
    // Starting from goalId, Make move

    // Fade
  }

  getBestNextDirection(position) {
    let directions = this.decodedMapDirections;
    return directions[position.direction.getNumber()][position.x][position.y];
  }

  testBrain() {
    console.log("Testing Brain");
    console.log("Chosen Move: "+this.brain.getMove(this.brain.getOutputs(getInputs())));
  }
}
