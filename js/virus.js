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
