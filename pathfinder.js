let _ = require('lodash'),
  distance = require('./distance');

class Systems {
  constructor() {
    this.data = require('./systems').map(system => {
      return new System(system);
    });
  }

  within(radius, origin) {
    return this.data.map(system => {
      return distance(origin, system) <= radius;
    });
  }

  findById(id) {
    return _.findWhere(this.data, { id: id })
  }
}


class System {
  constructor(system) {
    Object.assign(this, system);
  }

  // returns a theorhetical point
  findGoal(target, max) {
    let d = distance(this, target);
    if (d < max)
      return target;
    let goal = {
      x: target.x,
      y: target.y,
      z: target.z
    };

    while (d > max) {
      goal.x = start.x + ((Math.abs(start.x - goal.x)) / 1.001); // more 0 == more precision
      goal.y = start.y + ((Math.abs(start.y - goal.y)) / 1.001); // more 0 == more precision
      goal.z = start.z + ((Math.abs(start.z - goal.z)) / 1.001); // more 0 == more precision
      d = distance(this, goal);
    }

    return goal;
  }
}

let systems = new Systems();

let start = systems.findById(889),
  end = systems.findById(888);

console.log('Start: ', start);
console.log('End:', end);
console.log('Distance:', distance(start, end));

let goal = start.findGoal(end, 10);

console.log(goal);
