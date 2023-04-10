class Board {
   constructor (height, width) {
     this.height = height;
     this.width = width;
     this.x_offset = 1;
     this.y_offset = 1;
     this.pieces = [];
     this.color = "lightgray";
  }

  display() {
    let board = document.getElementById("board");
    board.style.height = ""+(this.height*50)+"px";
    board.style.width = ""+(this.width*50)+"px";
    this.populate();
    //Display Pieces
    for (let i=0;i<this.pieces.length;i++)
    {
      this.pieces[i].display();
    }

  }

  populate() {
    console.log("Populating");
    for (let i=1; i<=this.height;i++){
      for(let j=1; j<=this.width;j++){
        let block = new Block(null, j, i, gameBoard);
        block.display();
      }
    }
  }
}
