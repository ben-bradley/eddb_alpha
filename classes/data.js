let _ = require('lodash');

class Data {
  constructor(source) {
    this.data = require(source);
  }

  findWhere(kv) {
    return _.findWhere(this.data, kv);
  }

  findById(id) {
    return _.findWhere(this.data, { id: id });
  }

  findByName(name) {
    return _.findWhere(this.data, { name: name });
  }

  filter(cb) {
    return this.data.filter(cb);
  }
}

module.exports = Data;
