class Player {
  constructor (x, y, direction) {
    this.position = new Position(x,y,direction);
  }

  display() {
    let mainBlockView = this.findBlockById(this.getLocationId(0,0));
    mainBlockView.classList.add("player");
    if (this.position.direction.name) {
      let secondaryBlockView = this.findBlockById(this.getLocationId(this.position.direction.xOffset(), this.position.direction.yOffset()));
      secondaryBlockView.classList.add("playerSecond");
    }
  }

  erase() {
    let mainBlockView = this.findBlockById(this.getLocationId(0,0));
    mainBlockView.classList.remove("player");
    if (this.position.direction.name) {
      let secondaryBlockView = this.findBlockById(this.getLocationId(this.position.direction.xOffset(), this.position.direction.yOffset()));
      secondaryBlockView.classList.remove("playerSecond");
    }
  }

  findBlockById(blockId) {
    return document.getElementById(blockId);
  }

  getLocationId(x_offset, y_offset) {
    return (this.position.x+x_offset)+""+(this.position.y+y_offset);
  }

  move(direction){
    let moveSuccessful = false;
    if(!mapManager.editing){
      switch(direction){
        case "N":
          moveSuccessful = this.moveN();
          break;
        case "E":
          moveSuccessful = this.moveE();
          break;
        case "S":
          moveSuccessful = this.moveS();
          break;
        case "W":
          moveSuccessful = this.moveW();
          break;
        default:
          console.log("ERROR!");
          alert("ERROR!");
          break;
      }
      if (moveSuccessful || ai.running) {
        game.moveNum++;
      }
      app.updateSidebar();
      if (this.getLocationId(0,0) == game.board.map.goalId && this.position.direction.name == null){
        game.victory();
      }
    }
  }

  moveN() {
    // 3 cases.
    if ((this.position.direction.name == null) && this.position.x > 1 && !(this.findBlockById(this.getLocationId(-1,0)).classList.contains("dead")) &&!(this.findBlockById(this.getLocationId(-2,0)).classList.contains("dead"))) {
      this.erase();
      this.position.x--;
      this.position.direction = new Direction("N");
      this.display();
      return true;
    } else if ((this.position.direction.name == "N") && this.position.x > 1 &&!(this.findBlockById(this.getLocationId(-2,0)).classList.contains("dead"))) {
      this.erase();
      this.position.x -= 2;
      this.position.direction = new Direction(null);
      this.display();
      return true;
    } else if ((this.position.direction.name == "W") && this.position.x > 0 && !(this.findBlockById(this.getLocationId(-1,0)).classList.contains("dead")) && !(this.findBlockById(this.getLocationId(-1,-1)).classList.contains("dead"))) {
      this.erase();
      this.position.x--;
      this.display();
      return true;
    }
    return false;
  }

  moveS() {
    // 3 cases.
    if ((this.position.direction.name == null) && this.position.x < 8 && !(this.findBlockById(this.getLocationId(1,0)).classList.contains("dead")) &&!(this.findBlockById(this.getLocationId(2,0)).classList.contains("dead"))) {
      this.erase();
      this.position.x += 2;
      this.position.direction = new Direction("N");
      this.display();
      return true;
    } else if ((this.position.direction.name == "N") && this.position.x < 9 && !(this.findBlockById(this.getLocationId(1,0)).classList.contains("dead"))) {
      this.erase();
      this.position.x++;
      this.position.direction = new Direction(null);
      this.display();
      return true;
    } else if ((this.position.direction.name == "W") && this.position.x < 9 && !(this.findBlockById(this.getLocationId(1,0)).classList.contains("dead")) && !(this.findBlockById(this.getLocationId(1,-1)).classList.contains("dead"))) {
      this.erase();
      this.position.x++;
      this.display();
      return true;
    }
    return false;
  }

  moveE() {
    // 5 cases.
    if ((this.position.direction.name == null) && this.position.y < 8 && !(this.findBlockById(this.getLocationId(0,1)).classList.contains("dead")) &&!(this.findBlockById(this.getLocationId(0,2)).classList.contains("dead"))) {
      this.erase();
      this.position.y += 2;
      this.position.direction = new Direction("W");
      this.display();
      return true;
    } else if ((this.position.direction.name == "N") && this.position.y < 9 && !(this.findBlockById(this.getLocationId(0,1)).classList.contains("dead")) && !(this.findBlockById(this.getLocationId(-1,1)).classList.contains("dead"))) {
      this.erase();
      this.position.y++;
      this.display();
      return true;
    } else if ((this.position.direction.name == "W") && this.position.y < 9 && !(this.findBlockById(this.getLocationId(0,1)).classList.contains("dead"))) {
      this.erase();
      this.position.y++;
      this.position.direction = new Direction(null);
      this.display();
      return true;
    }
    return false;
  }

  moveW() {
    // 5 cases.
    if ((this.position.direction.name == null) && this.position.y > 1 && !(this.findBlockById(this.getLocationId(0,-1)).classList.contains("dead")) &&!(this.findBlockById(this.getLocationId(0,-2)).classList.contains("dead"))) {
      this.erase();
      this.position.y--;
      this.position.direction = new Direction("W");
      this.display();
      return true;
    } else if ((this.position.direction.name == "N") && this.position.y > 0 && !(this.findBlockById(this.getLocationId(0,-1)).classList.contains("dead")) && !(this.findBlockById(this.getLocationId(-1,-1)).classList.contains("dead"))) {
      this.erase();
      this.position.y--;
      this.display();
      return true;
    } else if ((this.position.direction.name == "W") && this.position.y > 1 && !(this.findBlockById(this.getLocationId(0,-1)).classList.contains("dead")) && !(this.findBlockById(this.getLocationId(0,-2)).classList.contains("dead"))) {
      this.erase();
      this.position.y -= 2;
      this.position.direction = new Direction(null);
      this.display();
      return true;
    }
    return false;
  }

}
