var Data = require('./data'),
  _ = require('lodash');

class Commodities extends Data {
  constructor() {
    super('../data/commodities');
  }

}

module.exports = Commodities;
