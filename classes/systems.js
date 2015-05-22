var Data = require('./data'),
  System = require('./system'),
  distance = require('../util/distance');

class Systems extends Data {
  constructor() {
    super('../data/systems');
    this.data = this.data.map(system => {
      return new System(system);
    });
  }

  adjacent(system, ly) {
    return this.filter(_system => {
      return system.id !== _system.id &&
        distance(system, _system) <= ly;
    });
  }
}

module.exports = Systems;
