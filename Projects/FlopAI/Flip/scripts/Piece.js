class Piece {
  constructor (id, x_offset, y_offset, height, width, color, alive) {
    this.id = id;
    this.x_offset = x_offset;
    this.y_offset = y_offset;
    this.height = height;
    this.width = width;
    this.color = color;
    this.alive = alive;
    this.blocks = [];
  }

  display() {
    //Display Blocks
    for (let i=0;i<this.blocks.length;i++)
    {
      this.blocks[i].display();
    }
  }


  flip(direction) {
    if (direction == "up") {
      //Make new blocks positioned relative to location
      //Add them to the piece, redisplay piece
      let newBlocks = [];
      for (let i=0;i<this.blocks.length;i++){
        //height - offset + 1 is new offset
       let block = new Block(null, this.blocks[i].x_offset, (this.height - this.blocks[i].y_offset + 1), this);
       this.blocks[i].y_offset += this.height;
       newBlocks.push(block);
      }
      for (let i=0;i<newBlocks.length;i++){
        this.blocks.push(newBlocks[i])
      }
      this.y_offset -= this.height;
      this.height *= 2;
    //} else if (direction.equals("right")) {

    } else if (direction == "down") {
      let newBlocks = [];
      for (let i=0;i<this.blocks.length;i++){
        //height - offset + 1 is new offset
       let block = new Block(null, this.blocks[i].x_offset, (this.height - this.blocks[i].y_offset + 1), this);
       block.y_offset += this.height;
       newBlocks.push(block);
      }
      for (let i=0;i<newBlocks.length;i++){
        this.blocks.push(newBlocks[i])
      }
      this.height *= 2;
    //} else if (direction.equals("right")) {

    }
    this.display();
  }
}
