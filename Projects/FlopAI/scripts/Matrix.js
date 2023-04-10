class Matrix {
  //A class for dealing with matrixes
  //[[1,2,3,4,5,6,7],[8,9,1,2,3,4,5],[6,7,8,9,1,2,3]]
  constructor(rowsOrArray, cols) {
    if (cols == undefined) {
      this.array = rowsOrArray;
      this.rows = this.array.length;
      this.cols = this.array[0].length;
    } else {
      this.array = [];
      this.rows = rowsOrArray;
      this.cols = cols;
      for (let i=0; i<rowsOrArray;i++) {
        this.array.push([]);
      }
    }
  }

  fromArray(matrixArray) {
    if (!(matrixArray.length)) {
      alert("ERROR using Matrix: Must have at least 1 row!");
    } else if ((!matrixArray[0].length)) {
      alert("ERROR using Matrix: Must have at least 1 column!");
    }
    let rows = 0;
    let cols = 0;
    this.array = matrixArray;
    for (rows=0;rows<this.array.length;rows++) {
    }
    if (rows > 0) {
      for (cols=0;cols<this.array[0].length;cols++) {
      }
    }
    this.rows = rows;
    this.cols = cols;
    //validation
    let check = this.array[0].length;
    for (let r=0;r<this.array.length;r++){
      if(this.array[r].length != check) {
        alert("BAD MATRIX, Must have equal number of columns in each row!");
        console.trace();
      }
    }
    return this;
  }

  to1DArray() {
    let array = [];
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0;col<this.cols; col++) {
          val = this.getVal(row,col);
          array.push(val);
      }
    }
    return array;
  }

  toMapArray() {
    let array = [];
    let rowArray = [];
    for (let row=0; row<this.rows; row++) {
      rowArray = [];
      for (let col=0;col<this.cols; col++) {
          rowArray.push(this.getVal(row,col));
      }
      array.push(rowArray);
    }
    return array;
  }

  setVal(row, col, value) {
    this.array[row][col] = value;
  }

  getVal(row,col) {
    return this.array[row][col];
  }

  randomize() {
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0; col<this.cols; col++) {
          val = System.getRandPMNormal();
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  zero() {
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0;col<this.cols; col++) {
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  map(func) {
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0;col<this.cols; col++) {
          val = func(this.getVal(row,col));
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  add(m1) {
    if (!(m1.rows == this.rows && m1.cols == this.cols)) { alert("Bad Matrix Addition"); console.log("Bad Matrix Addition"); this.print(); m1.print(); console.trace();}
    let val = 0;
    for (let row=0; row<m1.rows; row++) {
      for (let col=0;col<m1.cols; col++) {
          val = m1.getVal(row,col) + this.getVal(row,col);
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  scalar(scalar) { // m1 * -1
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0;col<this.cols; col++) {
          val = this.getVal(row,col) * scalar;
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  dot(m1) {
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0;col<this.cols; col++) {
          val = this.getVal(row,col) * m1.getVal(row,col);
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  toString() {
    let string = "[";
    for (let row=0; row<this.rows; row++) {
      string += "[";
      for (let col=0;col<this.cols; col++) {
        string += ""+this.getVal(row, col);
        if(col != this.cols-1) {
          string += ", ";
        } else {
          string += "]";
        }
      }
      if(row != this.rows-1) {
        string += ", ";
      } else {
        string += "]";
      }
    }
    return string;
  }

  static fromString(text) {
    text = text.substring(text.indexOf("[")+1, text.lastIndexOf("]"));
    let rows = text.substring(1, text.length-1).split("], [");
    for (let i=0; i<rows.length;i++) {
      rows[i] = rows[i].split(", ").map(x => parseInt(x));
    }
    return new Matrix(rows);
  }

  print() {
    console.log(this.toString());
  }

  subtract(m1) { // this - m1
    if (!(m1.rows == this.rows && m1.cols == this.cols)) { alert("Bad Matrix Subtraction"); console.log("Bad Matrix Subtraction"); this.print(); m1.print(); console.log(m1.rows+" == "+this.rows +"?\n"+m1.cols+" == "+this.cols+"?"); console.trace();}
    let val = 0;
    for (let row=0; row<m1.rows; row++) {
      for (let col=0;col<m1.cols; col++) {
          val = this.getVal(row,col) - m1.getVal(row,col);
          this.setVal(row,col,val);
      }
    }
    return this;
  }

  getMultiply(m1) { // this * m1 // [[1,2],[3,4]]
    if (!(this.cols == m1.rows)) { alert("Bad Matrix Multiplication"); console.log("Bad Matrix Multiplication"); this.print(); m1.print(); console.trace();}
    let result = new Matrix(this.rows,m1.cols);
    let sum = 0;
    for (let row=0; row<this.rows;row++) {
      for (let col=0; col<m1.cols;col++) {
        sum = 0;
        for (let item=0;item<m1.rows;item++) {
          sum += this.getVal(row, item) * m1.getVal(item,col);
        }
        result.setVal(row,col,sum);
      }
    }
    return result;
  }

  getTranspose() {  // m1^T (rows -> cols)
    //HIDE
    let result = new Matrix(this.cols,this.rows);
    for (let row=0; row<this.rows;row++) {
      for (let col=0; col<this.cols;col++) {
        result.setVal(col,row,this.getVal(row,col));
      }
    }
    return result;
  }

  getCopy() {
    let result = new Matrix(this.rows,this.cols);
    for (let row=0; row<this.rows;row++) {
      for (let col=0; col<this.cols;col++) {
        result.setVal(row,col,this.getVal(row,col));
      }
    }
    return result;
  }
}
