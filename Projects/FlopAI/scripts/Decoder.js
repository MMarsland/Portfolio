class Decoder {
  constructor(mapArray) {
    this.mapArray = mapArray;
    this.decodedMap;
    this.pieces = [[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]]];
    //this.decode();
  }

  async decode() {
    console.log("DECODING");
    //Will this let me fold it?
    // Assign Values to all pieces
    for (let z=0; z<3; z++) {
      for (let x=0; x<10; x++) {
        for (let y=0; y<10; y++) {
          // Find Goal (Assign 1)
          if (z == 0) { // Up, North, East, South, West.
            // i.e. standing on goal
            this.pieces[z][x][y] = (this.mapArray[x][y] == 2)? "G" : null;
          } else {
            this.pieces[z][x][y] = null;
          }
        }
      }
    }

    // Repeat (Until all pieces have a value)
    let tempPieces = this.clone(this.pieces);
    let itrCount = 0;
    let playerFound = false;
    let iterationPieces = [];
    while (itrCount < 50 && !playerFound) {

      let dir;
      for (let z=0; z<3; z++) {
        for (let x=0; x<10; x++) {
          for (let y=0; y<10; y++) {
            // Don't re-assess peices with a direction
            if (this.pieces[z][x][y] == null) {
              // Limit to legal positions
              if (this.isLegalPosition(x, y, z)) {
                dir = this.getDirectionFor(x, y, z);
                if (dir != null) {
                  tempPieces[z][x][y] = dir;
                  iterationPieces.push({"x":x, "y":y, "z": z});
                  if (game.player.position.matches(x, y, z)) {
                    playerFound = true;
                  }
                }
              }
            }
          }
        }
      }
      itrCount++;
      this.pieces = this.clone(tempPieces);
      if (!playerFound) {
        Decoder.flashPieces(iterationPieces);
        iterationPieces = [];
        await System.sleep(1000);
      } else {
        Decoder.highlightPieces(iterationPieces);
        //CELEBRATE
        document.getElementById(game.player.position.x+""+game.player.position.y).classList.add("glow");
      }
    }
    return tempPieces;
  }

  fastDecode() {
    // Assign Values to all pieces
    for (let z=0; z<3; z++) {
      for (let x=0; x<10; x++) {
        for (let y=0; y<10; y++) {
          // Find Goal (Assign 1)
          if (z == 0) { // Up, North, East, South, West.
            // i.e. standing on goal
            this.pieces[z][x][y] = (this.mapArray[x][y] == 2)? "G" : null;
          } else {
            this.pieces[z][x][y] = null;
          }
        }
      }
    }


    // Repeat (Until all pieces have a value)
    let tempPieces = this.clone(this.pieces);
    let itrCount = 0;
    let playerFound = false;
    let iterationPieces = [];
    while (itrCount < 50) {

      let dir;
      for (let z=0; z<3; z++) {
        for (let x=0; x<10; x++) {
          for (let y=0; y<10; y++) {
            // Don't re-assess peices with a direction
            if (this.pieces[z][x][y] == null) {
              // Limit to legal positions
              if (this.isLegalPosition(x, y, z)) {
                dir = this.getDirectionFor(x, y, z);
                if (dir != null) {
                  tempPieces[z][x][y] = dir;
                  iterationPieces.push({"x":x, "y":y, "z": z});
                }
              }
            }
          }
        }
      }
      itrCount++;
      this.pieces = this.clone(tempPieces);
      iterationPieces = [];
    }
    return tempPieces;
  }

  getDirectionFor(x,y,z) {
    let north,east,south,west;
    north = this.isLegalMove(x,y,z,"N")? true : false;
    east = this.isLegalMove(x,y,z,"E")? true : false;
    south = this.isLegalMove(x,y,z,"S")? true : false;
    west = this.isLegalMove(x,y,z,"W")? true : false;
    return this.getRandDirection(x,y,z,north,east,south,west);
  }

  getCoordsFrom(x,y,z,direction) {
    //console.log("Starting Coords: ("+x+", "+y+", "+z+", "+direction+")");
    let coords = [-1,-1,-1];
    if (z == 0) {
      if (direction == "N") {
        coords = [x-1, y, 1];
      } else if (direction == "E") {
        coords = [x, y+2, 2];
      } else if (direction == "S") {
        coords = [x+2, y, 1];
      } else if (direction == "W") {
        coords = [x, y-1, 2];
      }
    } else if (z == 1) {
      if (direction == "N") {
        coords = [x-2, y, 0];
      } else if (direction == "E") {
        coords = [x, y+1, 1];
      } else if (direction == "S") {
        coords = [x+1, y, 0];
      } else if (direction == "W") {
        coords = [x, y-1, 1];
      }
    } else if (z == 2) {
      if (direction == "N") {
        coords = [x-1, y, 2];
      } else if (direction == "E") {
        coords = [x, y+1, 0];
      } else if (direction == "S") {
        coords = [x+1, y, 2];
      } else if (direction == "W") {
        coords = [x, y-2, 0];
      }
    }
    //console.log("Final Coords: ("+coords[0]+", "+coords[1]+", "+coords[2]+")");
    return coords;
  }

  getRandDirection(x, y, z, north, east, south, west) {
    // Returns a random direction from the nearby directions or null.
    //console.log("Getting a Random Direction for ("+x+", "+y+", "+z+") in the ( "+ (north?"North ":"")+(east?"East ":"")+(south?"South ":"")+(west?"West )":")"));
    let directions = [];
    let coords, dir;
    if (north) {
      coords = this.getCoordsFrom(x,y,z, "N");
      dir = this.pieces[coords[2]][coords[0]][coords[1]];
      if (dir != null) {
        directions.push("N");
      }
    }
    if (east) {
      coords = this.getCoordsFrom(x,y,z, "E");
      dir = this.pieces[coords[2]][coords[0]][coords[1]];
      if (dir != null) {
        directions.push("E")
      }
    }
    if (south) {
      coords = this.getCoordsFrom(x,y,z, "S");
      dir = this.pieces[coords[2]][coords[0]][coords[1]];
      if (dir != null) {
        directions.push("S")
      }
    }
    if (west) {
      coords = this.getCoordsFrom(x,y,z, "W");
      dir = this.pieces[coords[2]][coords[0]][coords[1]];
      if (dir != null) {
        directions.push("W")
      }
    }
    // Directions Array established!
    // Pick a random one!
    if (directions.length == 0) {
      return null;
    } else {
      return directions[System.getRandInt(0,directions.length-1)];
    }
  }

  clone(array) {
    let temp = [[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]]];
    for (let z=0; z<3; z++) {
      for (let x=0; x<10; x++) {
        for (let y=0; y<10; y++) {
          temp[z][x][y] = array[z][x][y];
        }
      }
    }
    return temp;
  }

  getReverseMoveOrder() {
    let moveOrder = this.getMoveOrder();
    let reverseOrder = [];
    let direction;
    for (let i=moveOrder.length-1;i>=0;i--){
      switch (moveOrder[x]) {
        case "N":
          direction = "S";
          break;
        case "E":
          direction = "W";
          break;
        case "S":
          direction = "N";
          break;
        case "W":
          direction = "E";
          break;
        default:
          alert("ERROR!!!");
      }
      reverseOrder.push(direction);
    }
    return reverseOrder;
  }

  getMoveOrder() {
      //Fake move the player basically..
      let startCoords = Coord.create(game.board.map.playerStartPosition.getCoords());
      let endId = game.board.map.goalId;
      let endCoords =  Coord.create([endId.substring(0,1), endId.substring(1,2), 0]);
      let currCoords = startCoords;
      let moveOrderArray = [];
      let moveOrderCoords = [];
      // Pieces, z, x, j = z, x, y
      while (!currCoords.equals(endCoords)) {
        let bestMove = this.getMoveFromCoords(currCoords)
        moveOrderArray.push(bestMove);
        console.log(moveOrderCoords);
        console.log(currCoords);
        moveOrderCoords.push(currCoords);


        currCoords = this.makeFakeMove(currCoords, bestMove);
      }
      return moveOrderCoords;
  }

  makeFakeMove(startCoords, direction) {
    //HIDE
    // Don't worry about limits, just make the move!
    let endCoords = startCoords;
    if (direction == "N") {
      if (startCoords.z == 0) {
        endCoords.x--;
        endCoords.z = 1;
      } else if (startCoords.z == 1) {
        endCoords.x -= 2;
        endCoords.z = 0;
      } else if (startCoords.z == 2) {
        endCoords.x--;
        endCoords.z = 2;
      }
    } else if (direction == "E") {
      if (startCoords.z == 0) {
        endCoords.y += 2;
        endCoords.z = 2;
      } else if (startCoords.z == 1) {
        endCoords.y++;
        endCoords.z = 1;
      } else if (startCoords.z == 2) {
        endCoords.y++;
        endCoords.z = 0;
      }
    } else if (direction == "S") {
      if (startCoords.z == 0) {
        endCoords.x += 2;
        endCoords.z = 1;
      } else if (startCoords.z == 1) {
        endCoords.x++;
        endCoords.z = 0;
      } else if (startCoords.z == 2) {
        endCoords.x++;
        endCoords.z = 2;
      }
    } else if (direction == "W") {
      if (startCoords.z == 0) {
        endCoords.y--;
        endCoords.z = 2;
      } else if (startCoords.z == 1) {
        endCoords.y--;
        endCoords.z = 1;
      } else if (startCoords.z == 2) {
        endCoords.y -= 2;
        endCoords.z = 0;
      }
    } else {
      alert("ERROR!");
      console.log("ERROR!");
    }
    return endCoords;
  }

  getMoveFromCoords(coords) {
    // Hide
    return this.pieces[coords.z][coords.x][coords.y];
  }

  isLegalMove(x,y,z, direction) {
    let illegalDirections = [];
    if (z == 0) {
      if (x == 0 || x == 1 || this.mapArray[x-1][y] == 0 || this.mapArray[x-2][y] == 0) {
        illegalDirections.push("N");
      }
      if (x == 8 || x == 9 || this.mapArray[x+1][y] == 0 || this.mapArray[x+2][y] == 0) {
        illegalDirections.push("S");
      }
      if (y == 0 || y == 1 || this.mapArray[x][y-1] == 0 || this.mapArray[x][y-2] == 0) {
        illegalDirections.push("W");
      }
      if (y == 8 || y == 9 || this.mapArray[x][y+1] == 0 || this.mapArray[x][y+2] == 0) {
        illegalDirections.push("E");
      }
    }
    else if (z == 1) {
      if (x == 1 || this.mapArray[x-2][y] == 0) {
        illegalDirections.push("N");
      }
      if (x == 9 || this.mapArray[x+1][y] == 0) {
        illegalDirections.push("S");
      }
      if (y == 0 || this.mapArray[x][y-1] == 0 || this.mapArray[x-1][y-1] == 0) {
        illegalDirections.push("W");
      }
      if (y == 9 || this.mapArray[x][y+1] == 0 || this.mapArray[x-1][y+1] == 0) {
        illegalDirections.push("E");
      }
    }
    else if (z == 2) {
      if (x == 0 || this.mapArray[x-1][y] == 0 || this.mapArray[x-1][y-1] == 0) {
        illegalDirections.push("N");
      }
      if (x == 9 || this.mapArray[x+1][y] == 0 || this.mapArray[x+1][y-1] == 0) {
        illegalDirections.push("S");
      }
      if (y == 1 || this.mapArray[x][y-2] == 0 ) {
        illegalDirections.push("W");
      }
      if (y == 9 || this.mapArray[x][y+1] == 0) {
        illegalDirections.push("E");
      }
    }

    if (illegalDirections.includes(direction)) {
      return false;
    }
    return true;
  }

  isLegalPosition(x, y, z) {
    // Check Edges
    if (z == 1 && x == 0) {
      return false;
    } else if (z == 2 && y == 0) {
      return false;
    }
    // Check dead squares
    if (z == 0 && this.mapArray[x][y] == "0") {
      return false;
    } else if (z == 1 && (this.mapArray[x][y] == "0" || this.mapArray[x-1][y] == "0")) {
      return false;
    } else if (z == 2 && (this.mapArray[x][y] == "0" || this.mapArray[x][y-1] == "0")) {
      return false;
    }
    return true;
  }

  /* Animation Methods (Temp?) */
  static flashPiece(x,y,z) {
    console.log("x: " + x + ", y: "+ y + ", z: "+ z);
    if (z==0) {//xy
      this.flashBlock(x + "" + y);
    } else if (z==1) { //xy and x-1y
      this.flashBlock(x + "" +y);
      this.flashBlock((x-1) + "" +y);
    } else if (z==2) { //xy and xy-1
      this.flashBlock(x + "" +y);
      this.flashBlock(x + "" +(y-1));
    }
  }

  static flashBlock(blockid) {
    console.log(blockid);
    let block = document.getElementById(blockid);
    block.classList.remove("flash");
    block.offsetWidth; //FLUSH
    block.classList.add("flash");
    setTimeout(() => {
        console.log(block);
        block.classList.remove("flash");
        block.classList.add("highlighted");
      }, 1000);
  }

  static highlightPiece(x,y,z) {
    if (z==0) {//xy
      this.highlightBlock(x + "" + y);
    } else if (z==1) { //xy and x-1y
      this.highlightBlock(x + "" +y);
      this.highlightBlock((x-1) + "" +y);
    } else if (z==2) { //xy and xy-1
      this.highlightBlock(x + "" +y);
      this.highlightBlock(x + "" +(y-1));
    }
  }

  static highlightBlock(blockid) {
    let block = document.getElementById(blockid);
    block.classList.add("highlighted");
  }

  static flashPieces(pieces) {
    let piece;
    for (let i=0;i<pieces.length; i++){
      piece = pieces[i];
      this.flashPiece(piece.x,piece.y,piece.z);
    }
  }

  static highlightPieces(pieces) {
    let piece;
    for (let i=0;i<pieces.length; i++){
      piece = pieces[i];
      this.highlightPiece(piece.x,piece.y,piece.z);
    }
  }
}
