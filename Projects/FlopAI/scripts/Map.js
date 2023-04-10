class Map {
  constructor(mapArray, name) {
    this.array = mapArray;
    this.playerStartPosition;
    this.goalId;
    if (name == undefined) {
      name = Map.getNewName();
    }
    this.name = name;
    this.init();
  }

  init() {
    for (let i=0; i<10; i++) {
      for (let j=0; j<10; j++) {
        if (this.array[i][j] == 2) {
            this.goalId = i+""+j;
        } else if (this.array[i][j] == 3) {
          this.playerStartPosition = new Position(i,j,null);
          if (i != 0){
            if (this.array[i-1][j] == 4) {
              this.playerStartPosition = new Position(i,j,"N");
            }
          }
          if (j != 0) {
            if (this.array[i][j-1] == 4) {
              this.playerStartPosition = new Position(i,j,"W");
            }
          }
        }
      }
    }
  }

  static getNewName() {
    let i=0;
    while (mapManager.hasOwnProperty(i)) {
      i++;
    }
    return i;
  }

  getMapText() {
    let text = System.getTabbedText(0, "Name: '"+this.name+"'");
    text += System.getTabbedText(0, "Array:\n{");
    text += System.getTabbedText(1, (new Matrix(this.array)).toString());
    text += System.getTabbedText(0, "}", true);
    return text;
  }

  static uploadGameSession(text) {
    let nodes = System.getTextNodes(System.getValue(text));
    let stg1 = Matrix.fromString(System.getValue(nodes[1]));
    let stg2 = stg1.toMapArray();
    let stg3 = System.getValue(nodes[0]);

    let map = new Map(stg2, stg3);
    return map;
  }
}
