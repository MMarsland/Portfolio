class Direction {
  constructor(name) {
    this.name = name;
  }

  xOffset() {
    if (this.name == "N") {
      return -1;
    } else {
      return 0;
    }
  }

  yOffset () {
    if (this.name == "W") {
      return -1;
    } else {
      return 0;
    }
  }

  getNumber() {
    if (this.name == null) {
      return 0;
    } else if (this.name == "N") {
      return 1;
    } else if (this.name == "W") {
      return 2;
    }
  }
}
