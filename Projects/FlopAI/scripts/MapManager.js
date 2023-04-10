class MapManager {
  constructor() {
    var mapDefault = new Map(mapArrayDefault, 'default', "New Level");
    var map1 = new Map(mapArray1, "Level 1");
    var map2 = new Map(mapArray2, "Level 2");
    var map3 = new Map(mapArray3, "Level 3");
    var map4 = new Map(mapArray4, "Level 4");
    var map5 = new Map(mapArray5, "Level 5");
    var map6 = new Map(mapArray6, "Level 6");
    var map7 = new Map(mapArray7, "Level 7");
    this.maps = [mapDefault, map1, map2, map3, map4, map5, map6, map7];

    this.editing = false;
    this.placingGoal = false;
    this.placingPlayer = false;
    this.testPlayer;
    this.levelPaneNum = null;
    this.lastLevelPane = -1;
    this.levelPaneLevelCount = 0;
  }
  // Gets an array for the current state of the map
  getMapArray() {
    var mapArray = [[],[],[],[],[],[],[],[],[],[]];
    for (let i=0; i<10; i++) {
      for (let j=0; j<10; j++) {
        let blockId = i+""+j;
        let block = document.getElementById(blockId);
        if (block.classList.contains("player")) {
          mapArray[i][j] = 3;
        } else if (block.classList.contains("playerSecond")) {
          mapArray[i][j] = 4;
        } else if (block.classList.contains("goal")) {
          mapArray[i][j] = 2;
        } else if (block.classList.contains("regular")) {
          mapArray[i][j] = 1;
        } else {
          mapArray[i][j] = 0;
        }
      }
    }
    return mapArray;
  }

  // Returns the map with the given name
  getMap(name) {
    for(let i=0;i<this.maps.length;i++) {
      if (this.maps[i].name === name) {
        return this.maps[i];
      }
    }
    console.log("Map with name \""+name+"\" not found!");
    return null; // Map not found, return default
  }

  /* Map Management (Downlaod and upload) */
  downloadMap(mapArray) {
    // Saves a map array
    let mapText = "[";
    for (let i=0; i<10; i++) {
      mapText += "[";
      for (let j=0; j<10; j++) {
        mapText += mapArray[i][j] + "";
        mapText += (j==9)? "" : ",";
      }
      mapText += (i==9)? "]" : "],\n";
    }
    mapText += "];";
    download("map", mapText);
  }

  getMapsText() {
    let text = System.getTabbedText(0, "Maps:");
    text += System.getTabbedText(0, "{");
    let mapsText = "";
    for (let i=0;i<this.maps.length;i++) {
      mapsText += System.getTabbedText(1, "Map "+i+":\n{");
      mapsText += System.getTabbedText(2, this.maps[i].getMapText());
      mapsText += System.getTabbedText(1, "}", (i == this.maps.length-1? true : false));
    }
    text += System.getTabbedText(0, mapsText);
    text += System.getTabbedText(0, "}", true);
    return text;
  }



  /* In session saving of maps (After editing or on upload) */
  quickSave() {
    console.log("Quick saving Map: "+ game.board.map.name);
    if (!(game.board.map.name === "New Level")) {
      this.saveMapAs(game.board.map.name);
    } else {
      alert("Don't quick save over the New Level template, you dumbass. Give it a cool name at least.");
      this.saveAs();
    }
  }

  saveAs() {
    let name = prompt("What would you like to name you map?", "Awesome Map");
    if (name == null) { // Null or empty str
      alert("NOT SAVED: A name must be provided");
      return;
    }
    if (name == "") {
      name = Map.getNewName();
    }
    this.verifyMapSaveWithName(name);
  }

  delete() {
    if (confirm("Are you sure you want to delete this map: \""+game.board.map.name+"\"? This action cannot be undone.")) {
      // Overwrite
      this.deleteMap(game.board.map);
    }
    this.editDone();
  }

  saveMapAs(name) {
    console.log("Saving as: "+ name);
    // OVER WRITE (AS DEFAULT)
    for (let map of this.maps) {
      if (map.name === name) {
        // Map name already exists
        map.array = this.getMapArray();
        map.init()
        this.editDone();
        this.switchMapTo(map);
        return;
      }
    }
    // Save as new map
    let map = new Map(this.getMapArray(), name);
    this.addMap(map);
    console.log("Map Saved");
    this.editDone();
    this.switchMapTo(map);
  }

  switchMapTo(map) {
    game.board.map = map;
  }

  verifyMapSaveWithName(name) {
    for (let map of this.maps) {
      if (map.name === name) {
        if (confirm("There is already a map with the name \""+name+"\". Would you like to overwrite it?")) {
          // Overwrite
          this.saveMapAs(name);

        } else {
          // Fail to save
          return;
        }
      }
    }
    this.saveMapAs(name);
  }



  uploadGameSession(text) {
    let maps = System.getTextNodes(text);
    this.maps = [];
    this.levelPaneNum = null;
    this.lastLevelPane = -1;
    this.levelPaneLevelCount = 0;
    // Visually Delete Maps panes
    document.getElementsByClassName("levelPaneArea")[0].innerHTML = "";
    for (let i=0;i<maps.length;i++) {
      this.addMap(Map.uploadGameSession(maps[i]));
    }
  }

  addMap(map) {
    this.maps.push(map);
    let paneNum = this.lastLevelPane;
    if (this.levelPaneLevelCount == 5 || this.lastLevelPane == -1){
      // Current last pane full or no pane
      this.createNewLevelPane();
    }
    // Add level to level pane
    let level = document.createElement("h3");
    // <h3 class="level" onclick="game.selectLevel(1)">Level 1</h3>
    level.setAttribute("class", "level");
    level.setAttribute("id", map.name);
    level.setAttribute("onclick", "game.selectLevel(\""+map.name+"\")");
    level.innerHTML = map.name;
    document.getElementsByClassName("levelPane")[this.lastLevelPane].appendChild(level);
    this.levelPaneLevelCount++;
  }

  deleteMap(map) {
    this.maps.splice(this.maps.indexOf(map), 1);
    let panes = document.getElementsByClassName("levelPaneArea")[0].children;
    for (let pane of panes) {
      let levels = pane.children;
      for (let level of levels) {
        console.log(level.innerHTML +" === "+ map.name);
        if (level.innerHTML === map.name) {
          pane.removeChild(level);
        }
      }
    }
    app.back();
  }

  createNewLevelPane() {

    let pane = document.createElement("div");
    pane.setAttribute("class", "levelPane "+ (this.lastLevelPane == -1 ? "" : "paneRight"));
    pane.setAttribute("paneNum", this.lastLevelPane+1);

    document.getElementsByClassName("levelPaneArea")[0].appendChild(pane);
    this.levelPaneLevelCount = 0;
    if (this.lastLevelPane == -1) {
      // Set the default page to the first (If it exists, when created)
      this.levelPaneNum = 0;
    }
    this.lastLevelPane++;

  }



  /* Map Editing */
  editDone() {
    //Hide
    if (this.editing) {
      this.done();
    } else {
      this.edit();
    }
  }

  edit() {
    document.getElementById("editDone").innerHTML = "Done";
    document.getElementById("playArea").classList.add("editing");
    document.getElementsByClassName("editButtons")[0].classList.remove("hidden");
    document.getElementsByClassName("editButtons")[1].classList.remove("hidden");
    document.getElementsByClassName("editButtons")[2].classList.remove("hidden");
    if (game.board.map.name === "New Level") {
      document.getElementsByClassName("editButtons")[0].classList.add("hidden");
      document.getElementsByClassName("editButtons")[2].classList.add("hidden");
    }
    this.editing = true;
  }

  done() {
    document.getElementById("editDone").innerHTML = "Edit";
    document.getElementById("playArea").classList.remove("editing");
    document.getElementsByClassName("editButtons")[0].classList.add("hidden");
    document.getElementsByClassName("editButtons")[1].classList.add("hidden");
    document.getElementsByClassName("editButtons")[2].classList.add("hidden");
    this.editing = false;
  }

  movePlayer(event) {
    if (game.player.position.direction.getNumber() == 0) {
      let block = event.target;
      block.classList.remove("player");
      block.classList.remove("regular");
      block.classList.add("dead");
      this.placingPlayer = true;
      document.getElementById("playArea").classList.add("placingPlayer");
    }
  }

  moveGoal(event) {
    let block = event.target;
    block.classList.remove("goal");
    block.classList.remove("regular");
    block.classList.add("dead");
    this.placingGoal = true;
    document.getElementById("playArea").classList.add("placingGoal");
  }

  updateMap(type) {
    game.board.map = new Map(this.getMapArray());
    console.log("Setting new Player");
    game.player = new Player(game.board.map.playerStartPosition.x, game.board.map.playerStartPosition.y, game.board.map.playerStartPosition.direction.name);
  }

  /* Play area event (Click) Handling */
  clickBlock(event) {
    event.preventDefault();
    if(this.editing) {
      if (this.placingGoal) {
        if ( !(event.target.classList.contains("player") || event.target.classList.contains("playerSecond")) ) {
          event.target.classList.remove("dead");
          event.target.classList.add("regular", "goal");
          document.getElementById("playArea").classList.remove("placingGoal");
          this.placingGoal = false;
          this.updateMap("goal");
        }
      } else if (this.placingPlayer) {
        if (!event.target.classList.contains("goal")) {
          event.target.classList.remove("dead");
          event.target.classList.add("regular", "player");
          document.getElementById("playArea").classList.remove("placingPlayer");
          this.placingPlayer = false;
          this.updateMap("player");
        }
      } else if (event.target.classList.contains("player")) {
        this.movePlayer(event);
      } else if (event.target.classList.contains("playerSecond")) {
      } else if (event.target.classList.contains("goal")) {
        this.moveGoal(event);
      } else if (event.target.classList.contains("regular")) {
        event.target.classList.remove("regular");
        event.target.classList.add("dead");
      } else {
        event.target.classList.remove("dead");
        event.target.classList.add("regular");
      }
    }
  }

  specialBlock(event) {
    // Do nothing if right click on a block (FOR NOW! Could implement the addition of special blocks (While editing)(i.e. switches, shakey blocks, gates, bridges, etc...))
    event.preventDefault();
    if(this.editing) {
    }
  }


  /* Map Selection */
  rightArrow() {
    if (this.levelPaneNum < this.lastLevelPane) {
      document.getElementsByClassName("levelPane")[this.levelPaneNum].classList.add("paneLeft");
      document.getElementsByClassName("levelPane")[this.levelPaneNum+1].classList.remove("paneRight");
      this.levelPaneNum++;
    }
    this.updateArrows();
  }

  leftArrow() {
    if (this.levelPaneNum > 0) {
      document.getElementsByClassName("levelPane")[this.levelPaneNum].classList.add("paneRight");
      document.getElementsByClassName("levelPane")[this.levelPaneNum-1].classList.remove("paneLeft");
      this.levelPaneNum--;
    }
    this.updateArrows();
  }

  updateArrows() {
    if (this.levelPaneNum != 0) {
      document.getElementsByClassName("arrow-left")[0].classList.remove("disabled");
    } else {
      document.getElementsByClassName("arrow-left")[0].classList.add("disabled");
    }
    if (this.levelPaneNum == this.lastLevelPane) {
      document.getElementsByClassName("arrow-right")[0].classList.add("disabled");
    } else {
      document.getElementsByClassName("arrow-right")[0].classList.remove("disabled");
    }
  }
}
