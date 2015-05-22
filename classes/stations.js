var Data = require('./data'),
  _ = require('lodash');

class Stations extends Data {
  constructor() {
    super('../data/stations');
  }

  inSystem(system) {
    return this.data.filter(station => {
      return station.system_id === system.id;
    });
  }

}

module.exports = Stations;
