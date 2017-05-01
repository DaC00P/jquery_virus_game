const Coord = require('./coord');
const Virus = require('./virus');
const Board = require('./board');

function Viral(board) {
  this.livingCells = [];
  this.virii = [];
  this.board = board;
}

Viral.prototype.infection = function (coords) {
  let strain = $("form input:radio:checked").val();
  new Virus(coords, strain);
  let coordID = coords.split('-').map((coord) => {return parseInt(coord);});
  let element = $(`#${coordID[0]}-${coordID[1]}`);
  $(element).addClass(strain);
};


Viral.prototype.addCoords = function (coords) {
  let parsedCoords = coords.split('-').map((el) => {return parseInt(el);});
  this.livingCells.push(parsedCoords);
};


module.exports = Viral;
