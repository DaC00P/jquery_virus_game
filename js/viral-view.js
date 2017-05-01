const Board = require('./board.js');
const Viral = require('./viral.js');

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
