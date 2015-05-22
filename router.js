let _ = require('lodash'),
  distance = require('./distance');

class Hop {
  constructor(from, to) {
    this.from = from.id;
    this.to = to.id;
    this.distance = distance(from, to)
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
    return this.data.filter(_system => {
      return _system.id !== system.id &&
        !explored.has(_system.id) &&
        distance(_system, system) <= max;
    }).map(_system => {
      return new Hop(system, _system);
    }).sort(closest);
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
}

let closest = (a, b) => {
  if (a.distance > b.distance)
    return 1;
  return 0;
}

let systems = new Systems();

let start = systems.findById(889),
  end = systems.findById(888);

console.log('Start: ', start.name);
console.log('End:', end.name);
console.log('Distance:', distance(start, end));

let path = systems.findPath(start, end, 40);

console.log(path);

/*
{ id: 1,
  name: '1 G. Caeli',
  x: 80.90625,
  y: -83.53125,
  z: -30.8125,
  faction: 'Empire League',
  population: 6544826,
  government: 'Patronage',
  allegiance: 'Empire',
  state: 'None',
  security: 'Medium',
  primary_economy: 'Industrial',
  needs_permit: 0,
  updated_at: 1430931668 }

{ id: 838,
  name: 'Amemets',
  x: 87.90625,
  y: -81.5625,
  z: -30.8125,
  faction: null,
  population: null,
  government: null,
  allegiance: null,
  state: null,
  security: null,
  primary_economy: null,
  needs_permit: 0,
  updated_at: 1421504401 }

{ id: 4651,
  name: 'Esubilanque',
  x: 90.65625,
  y: -78.5625,
  z: -25.5625,
  faction: null,
  population: null,
  government: null,
  allegiance: null,
  state: null,
  security: null,
  primary_economy: null,
  needs_permit: 0,
  updated_at: 1421504534 }
*/
