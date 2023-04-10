class Coord {
  constructor(x, y, z){
    this.x = x; // 0 -> 9 (Top to Bottom)
    this.y = y; // 0 -> 9 (Left to Right)
    this.z = z; // 0 (Standing), 1 (Up), 2(Left)
  }

  static create(array) {
    return new Coord(array[0], array[1], array[2]);
  }

  equals(coord) {
    return (this.x == coord.x && this.y == coord.y && this.z == coord.z);
  }
}
