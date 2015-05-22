let _ = require('lodash'),
  distance = require('./distance');

class Hop {
  constructor(from, to) {
    this.from = from.id;
    this.to = to.id;
    this.x = to.x;
    this.y = to.y;
    this.z = to.z;
    this.distance = distance(from, to);
  }

  setRank(goal) {
    this.rank = distance(this, goal);
  }

}

class System {
  constructor(system) {
    Object.assign(this, system);
  }

  //  findHops(max, found) {
  //    return systems.filter(system => {
  //      return system.id !== this.id && // not this one
  //        !found.has(system.id) && // not already found
  //        distance(system, this) <= max; // within max dist
  //    }).map(system => { // make the hop object
  //      return new Hop(this, system);
  //    }).sort((a, b) => { // sort closest to farthest
  //      if (a.distance > b.distance)
  //        return 1;
  //      return 0;
  //    });
  //  }
}

class Systems {
  constructor() {
    this.data = require('./systems').map(system => {
      return new System(system);
    });
  }

  findById(id) {
    return _.findWhere(this.data, {
      id: id
    });
  }

  findByname(name) {
    return _.findWhere(this.data, {
      name: name
    });
  }

  findHops(system, max, explored) {
    if (!explored)
      explored = new Set();
    return _.sortBy(this.data.filter(_system => {
      return _system.id !== system.id &&
        !explored.has(_system.id) &&
        distance(_system, system) <= max;
    }).map(_system => {
      return new Hop(system, _system);
    }), 'distance');
  }

  findHopsBetween(start, end, max) {
    let hops = this.findHops(start, max),
      queue = hops.slice(),
      explored = new Set(),
      done = false;

    explored.add(start.id);

    while (!done) {
      queue.sort(closest);
      let next = queue.shift();
      if (!next)
        break;

      let system = this.findById(next.to),
        nextHops = this.findHops(system, max, explored);

      explored.add(next.to);

      for (var h in nextHops) {
        let hop = nextHops[h];
        hops.push(hop);
        if (hop.to === end.id) {
          done = true;
          break;
        }
        if (!explored.has(hop.to))
          queue.unshift(hop);
      }
    }

    return hops;
  }

  findPath(start, end, max) {
    let hops = this.findHopsBetween(start, end, max),
      lastHop = _.findWhere(hops, {
        to: end.id
      });

    if (!hops.length || !lastHop)
      return []; // no path to end
    else if (lastHop.from === start.id)
      return [lastHop]; // start & end are adjacent



    let retrace = (hop, path) => {
      if (!path)
        path = [];
      path.push(hop);
      if (hop.from === start.id)
        return path.reverse();
      let nextHop = _.findWhere(hops, { to: hop.from });
      return retrace(nextHop, path);
    }

    return retrace(lastHop);
  }

  findClosestPath(start, end, max) {
    let path = [];

    let selectBestHop = (system, end, max, explored) => {
      if (!explored)
        explored = new Set();
      let goal = findGoal(system, end, max);
      let hop = _.sortBy(this.findHops(system, max, explored).map(hop => {
        hop.setRank(goal);
        return hop;
      }), 'rank')[0];
      return hop;
    }

    let queue = this.findHops(system, max)


    return selectBestHop(start, end, max);

  }
}

let findGoal = (start, end, max) => {
  let d = distance(start, end);
  if (d < max)
    return end;

  let goal = {
    x: end.x,
    y: end.y,
    z: end.z
  }

  while (d > max) {
    goal.x = start.x + ((Math.abs(start.x - goal.x)) / 1.001); // more 0 == more precision
    goal.y = start.y + ((Math.abs(start.y - goal.y)) / 1.001); // more 0 == more precision
    goal.z = start.z + ((Math.abs(start.z - goal.z)) / 1.001); // more 0 == more precision
    d = distance(start, goal);
  }

  return goal;
}

let systems = new Systems();

let start = systems.findById(889),
  end = systems.findById(888);

console.log('Start: ', start);
console.log('End:', end);
console.log('Distance:', distance(start, end));

let path = systems.findClosestPath(start, end, 10);
console.log(path);
//let goal = findGoal(start, end, 10);
//
//console.log(goal);
//
//console.log(distance(start, goal))
