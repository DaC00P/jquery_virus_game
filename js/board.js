
function Board(size) {
  size = 100;
  this.size = size;
}

Board.BLANK_SYMBOL = "O";

Board.blankGrid = function (size) {
  const grid = [];

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(Board.BLANK_SYMBOL);
    }
    grid.push(row);
  }

  return grid;
};

Board.prototype.render = function () {
  const grid = Board.blankGrid(this.size);

  grid.map( row => row.join("") ).join("\n");
};

Board.prototype.returnSize = function () {
  return this.size;
};

module.exports = Board;
