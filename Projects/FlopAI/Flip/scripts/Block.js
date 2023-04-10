class Block {
  constructor (id, x_offset, y_offset, piece) {
    this.id = id;
    this.piece = piece;
    this.x_offset = x_offset;
    this.y_offset = y_offset;
    this.view = null;
  }

  display() {
    let board = document.getElementById("board");
    let block = document.createElement("div");
    block.setAttribute("class", "block");
    block.setAttribute("piece", this.piece.id);
    block.setAttribute("style", "left: "+(50*(this.x_offset+this.piece.x_offset-2))+"px");
    block.setAttribute("style", block.getAttribute("style")+"; top: "+(50*(this.y_offset+this.piece.y_offset-2))+"px");
    block.setAttribute("style", block.getAttribute("style")+"; background-color: "+this.piece.color);
    block.setAttribute("onmousedown", "selectBlock(event)");
    console.log(block);
    this.view = block;
    console.log(this.view);
    board.appendChild(block);
  }
}
