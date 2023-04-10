class Matrix {
  //A class for dealing with matrixes
  //[[1,2,3,4,5,6,7],[8,9,1,2,3,4,5],[6,7,8,9,1,2,3]]
  constructor(rowsOrArray, cols) {
    if (cols == undefined) {
      this.array = Matrix.deepCopyArray(rowsOrArray);
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

  static deepCopyArray(array) {
    let newArray = [];
    for (let i=0; i<array.length; i++) {
      if (array[i] instanceof Array) {
        newArray[i] = Matrix.deepCopyArray(array[i]);
      } else {
        newArray[i] = array[i];
      }
    }
    return newArray;
  }

  static from1DArraytoColumnMatrix(array) {
    let rows = array.length;
    let cols = 1;
    let matrix = new Matrix(rows, cols);
    for (let i=0; i<rows; i++) {
      matrix.setVal(i,0,array[i]);
    }
    return matrix;
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

  toColumnMatrix() {
    let array = [];
    for (let row=0; row<this.rows; row++) {
      for (let col=0;col<this.cols; col++) {
          array.push([this.getVal(row,col)]);
      }
    }
    return new Matrix(array);
  }

  setVal(row, col, value) {
    this.array[row][col] = value;
  }

  getVal(row,col) {
    return this.array[row][col];
  }

  getRow(row) {
    return this.array[row];
  }

  randomize() {
    let val = 0;
    for (let row=0; row<this.rows; row++) {
      for (let col=0; col<this.cols; col++) {
          val = (Math.random()*2 - 1);
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
        string += ",\n";
      } else {
        string += "]";
      }
    }
    return string;
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
    if (!(this.cols == m1.rows)) { alert("Bad Matrix Multiplication"); console.log("Bad Matrix Multiplication"); this.print(); m1.print(); console.trace(); throw ERROR;}
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
