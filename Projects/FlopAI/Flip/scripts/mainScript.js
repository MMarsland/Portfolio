var gameBoard;
var yellowPiece;

var selectEvent = null;

 function main() {
   // Level one
   gameBoard = new Board(8, 3);
   let bluePiece = new Piece(1, 2, 1, 1, 1, "blue", true);
   let greenPiece = new Piece(2, 2, 5, 1, 1, "green", true);
   yellowPiece = new Piece(3, 1, 5, 2, 3, "yellow", true);
   let redPiece = new Piece(4, 2, 8, 1, 1, "red", true);
   const block1 = new Block(1, 1, 1, bluePiece);
   const block2 = new Block(2, 1, 1, greenPiece);
   // Yellow
   const block3 = new Block(3, 1, 1, yellowPiece);
   const block4 = new Block(4, 3, 1, yellowPiece);
   const block5 = new Block(5, 1, 2, yellowPiece);
   const block6 = new Block(6, 2, 2, yellowPiece);
   const block7 = new Block(7, 3, 2, yellowPiece);
   //red
   const block8 = new Block(8, 1, 1, redPiece);

   bluePiece.blocks = [block1];
   greenPiece.blocks = [block2];
   yellowPiece.blocks = [block3,block4,block5,block6,block7];
   redPiece.blocks = [block8];
   gameBoard.pieces = [bluePiece,greenPiece,yellowPiece,redPiece];

   gameBoard.display();
 }


 function selectBlock(e) {
   e.preventDefault();

   selectEvent = e;
   setCursor("grabbing");
 }

 function mouseReleased(e) {
   e.preventDefault();
   if (selectEvent) {

     setCursor("grab");

     let piece;
     let pieceId = selectEvent.target.attributes.piece.nodeValue;
     console.log(pieceId);
     if (pieceId > 0) {
       piece = getPieceById(pieceId);
       //direction
       piece.flip(getDirectionOfMove(selectEvent, e));
     }
     selectEvent = null;
   }
 }

 function getPieceById(pieceId) {
   //Just a comment
   for (pieceIndex in gameBoard.pieces){ piece = gameBoard.pieces[pieceIndex];
     if (piece.id == pieceId){
       return piece;
     }
   }
 }

 function setCursor(cursorType) {
   document.getElementById("main").style.cursor = cursorType;
 }

 function getDirectionOfMove(start, end) {
   let startX = start.clientX;
   let startY = start.clientY;
   let endX = end.clientX;
   let endY = end.clientY;
   let deltaX = endX - startX;
   let deltaY = endY - startY;

   if (Math.abs(deltaX) > Math.abs(deltaY)){
     //Moving in the x
     if (deltaX >= 0) {
       return "right";
     } else {
       return "left";
     }
   } else {
     //Moving in the y
     if (deltaY >= 0) {
       return "down";
     } else {
       return "up";
     }
   }
 }
