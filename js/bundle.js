/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const ViralView = __webpack_require__(1);
	
	$(function () {
	  const rootEl = $('.viral');
	  new ViralView(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	const Viral = __webpack_require__(3);
	
	const View = function ($el) {
	  this.$el = $el;
	
	  this.board = new Board(4);
	  this.setupGrid();
	  $(".cell").click(this.handleClick.bind(this));
	  this.viral = new Viral(this.board);
	
	  $( "#clear-button" ).click(this.clearBoard.bind(this));
	
	  requestAnimationFrame(
	    this.render.bind(this)
	  );
	};
	
	
	View.prototype.render = function () {
	  this.$el.html(this.board.render());
	  requestAnimationFrame(
	    this.render.bind(this)
	  );
	};
	
	
	View.prototype.clearBoard = function () {
	  window.location.reload();
	  window.setTimeout(() => {
	    const rootEl = $('.viral');
	    new View(rootEl);
	  }, 1000);
	};
	
	View.prototype.setupGrid = function () {
	  let html = "";
	
	  for (let i = 0; i < this.board.size; i++) {
	    html += "<ul>";
	    for (let j = 0; j < this.board.size; j++) {
	      html += `<li class='cell' id="${i.toString()}-${j.toString()}"></li>`;
	    }
	    html += "</ul>";
	  }
	
	  this.$el.html(html);
	  this.$li = this.$el.find("li");
	};
	
	
	
	View.prototype.infectionType = function () {
	  this.strain = $("form input:radio:checked").val();
	};
	
	View.prototype.handleClick = function (event) {
	  //takes a click and starts the infection there
	  if (event.currentTarget.className.includes(this.strain)) {
	    alert('You cannot initiate an infection where there already is one.');
	  }
	  else {
	    $(event.currentTarget).addClass(this.strain);
	    this.viral.infection(event.currentTarget.id);
	  }
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(4);
	const Virus = __webpack_require__(5);
	const Board = __webpack_require__(2);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Coord (i, j) {
	  this.i = i;
	  this.j = j;
	}
	
	Coord.prototype.equals = function(coord2) {
		return (this.i == coord2.i) && (this.j == coord2.j);
	}; 
	
	Coord.prototype.isOpposite = function (coord2) {
	  return (this.i == (-1 * coord2.i)) && (this.j == (-1 * coord2.j));
	};
	
	Coord.prototype.plus = function (coord2) {
	  return new Coord(this.i + coord2.i, this.j + coord2.j);
	};
	
	module.exports = Coord;


/***/ },
/* 5 */
/***/ function(module, exports) {

	function Virus(coords, strain) {
	  this.coords = coords;
	  this.strain = strain;
	  this.adjacentCellsToInfect = [];
	  this.startInfection();
	  let self = this;
	  this.fadeColor(self.parseCoords(coords)); //this is broken
	}
	
	Virus.INFECTION_VALS = {
	  "virus": 7.0,
	  "bacteria": 6.0,
	  "parasite": 4.0
	};
	
	Virus.DIFFS = [
	  [-1, 0],
	  [0, 1],
	  [1, 0],
	  [0, -1],
	  [-1, 1],
	  [1, -1],
	  [1, 1],
	  [-1, -1]
	];
	
	Virus.propagationSpeeds = {
	  "virus": 400,
	  "bacteria": 800,
	  "parasite": 1000
	};
	
	Virus.prototype.startInfection = function () {
	  window.setTimeout(() => {
	    this.getAdjacentCells();
	    this.infectAdjacentCells();
	  }, Virus.propagationSpeeds[this.strain]);
	};
	
	Virus.prototype.live = function () {
	  let chance = Math.random() * 10.0;
	  if (Virus.INFECTION_VALS[this.strain] > chance){
	    return true;
	  }
	  else {
	    return false;
	  }
	};
	
	Virus.prototype.infectAdjacentCells = function () {
	  let self = this;
	  this.adjacentCellsToInfect.forEach((htmel) => {
	    let coordID = htmel.id.split('-').map((coord) => {return parseInt(coord);});
	    let element = $(`#${coordID[0]}-${coordID[1]}`);
	    if (this.live()){
	      $(element).addClass(self.strain);
	      let virii = new Virus(htmel.id, self.strain);
	      this.fadeColor(element);
	    }
	    else {
	      if (!(self.strain === 'parasite')){
	        $(element).addClass(`immune ${self.strain}`);
	      }
	    }
	  });
	};
	
	Virus.prototype.getAdjacentCells = function () {
	  const self = this;
	  Virus.DIFFS.forEach((diff) => {
	    let parsedCoords = this.parseCoords(self.coords);
	    let newCoord = [(diff[0] + parsedCoords[0]), (diff[1] + parsedCoords[1])];
	    let element = $(`#${newCoord[0]}-${newCoord[1]}`)[0];
	    if ( element !== undefined && !(element.className.includes(self.strain)) && this.strainRules(element) && this.notImmune(element)) {
	      self.adjacentCellsToInfect.push(element);
	    }
	  });
	};
	
	Virus.prototype.strainRules = function (element) {
	  let elementStrain = $(element);
	  if (this.strain === 'bacteria' && element.className.includes('parasite')) {
	    return false;
	  }
	  else if (this.strain === 'virus' && element.className.includes('bacteria')) {
	    return false;
	  }
	  else if (this.strain === 'virus' && element.className.includes('parasite')) {
	    return false;
	  }
	  else if (this.strain === 'parasite') {
	    return true;
	  }
	  else if (this.strain === 'bacteria' && element.className.includes('virus')) {
	    return true;
	  }
	  else {
	    return true;
	  }
	};
	
	Virus.prototype.notImmune = function (element) {
	  let elementStrain = $(element);
	  if (element.className.includes('immune')){
	    return false;
	  }
	  else {
	    return true;
	  }
	};
	
	Virus.prototype.parseCoords = function (coordString) {
	    return coordString.split('-').map((coord) => {return parseInt(coord);});
	};
	
	Virus.prototype.death = function (coordString) {
	  let chance = Math.random();
	  switch (this.strain) {
	    case "virus":
	      return (chance > 0.65);
	    case "bacteria":
	      return (chance > 0.8);
	    case "parasite":
	      return (chance > 0.95);
	    default:
	      break;
	    }
	};
	
	Virus.prototype.fadeColor = function (element) {
	  let classesToUse = this.strainToDisplay();
	
	  window.setTimeout(() => {
	    $(element).addClass(classesToUse[0]);
	  }, 3000);
	
	  window.setTimeout(() => {
	    $(element).removeClass(classesToUse[0]);
	    $(element).addClass(classesToUse[1]);
	  }, 6000);
	
	  if (this.death()) {
	    window.setTimeout(() => {
	      $(element).removeClass(classesToUse[1]);
	      $(element).addClass(classesToUse[2]);
	    }, 25000);
	  }
	};
	
	Virus.prototype.strainToDisplay = function () {
	  switch (this.strain) {
	    case "virus":
	      return ["v1", "v2", "v3"];
	    case "bacteria":
	      return ["b1", "b2", "b3"];
	    case "parasite":
	      return ["p1", "p2", "p3"];
	    default:
	      break;
	  }
	};
	
	module.exports = Virus;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map