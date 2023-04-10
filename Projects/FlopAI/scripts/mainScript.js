let app;
let ai;
let game;
let mapManager;
let coach;

let modifyingKeyOn = false;

// Load the app when the body UI Loads
function startUp() {
  // Start the system
  //system = new System();
  mapManager = new MapManager();
  ai = new AI();
  app = new App();
  game = new Game();
  coach = new Coach();
}

// Pickup key presses
document.onkeydown = function (e) {
    e = e || window.event;
    // use e.keyCode
    keyPressed(e.keyCode);
};

function keyPressed(keyCode) {
  //comment
  //console.log(keyCode);
  if (keyCode == 87 || keyCode == 38 && app.view == "board") { // W
    game.player.move("N");
  } else if (keyCode == 65 || keyCode == 37 && app.view == "board") { // A
    game.player.move("W");
  } else if (keyCode == 83 || keyCode == 40 && app.view == "board") { // S
    game.player.move("S");
  } else if (keyCode == 68 || keyCode == 39 && app.view == "board") { // D
    game.player.move("E");
  } else if (keyCode == 82 && app.view != "home") { // R
    game.reset();
  } else if (keyCode == 66) { // B
    app.back();
  } else if (keyCode == 69 && app.view == "board") { //<--"NICE" E
    mapManager.editDone();
  }else if (keyCode == 77 && app.view != "home") { // M
    mapManager.downloadMap(mapManager.getMapArray());
  } else if (keyCode == 80 && app.view != "home") { // P
    System.saveGame();
  } else if (keyCode == 84 && app.view != "home") { // T
    ai.testBrain(); // In Brain
  } else if (keyCode == 67 && app.view == "board") { // C "Decode and run animation"
    ai.demoCheatMode();
  } else if (keyCode == 89 && app.view != "home") { // Y
    ai.brain.randomizeBrain();
    if (app.view == "board") {
        app.updateSidebar();
    }
  } else if (keyCode == 71 && app.view == "board") { // G
    if (!ai.running) {
      ai.running = true;
      ai.run();
    } else {
      ai.running = false;
    }
  } else if (keyCode == 20) {
    modifyingKeyOn = !modifyingKeyOn;
  }
}
