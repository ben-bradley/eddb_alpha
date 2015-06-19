let args = require('argify'),
  _ = require('lodash');

let Systems = require('./classes/systems'),
  Stations = require('./classes/stations'),
  distance = require('./util/distance');

let systems = new Systems(),
  stations = new Stations();

if (!args.x || !args.y || !args.z)
  throw new Error('You need to provide --x, --y, and --z');

let distances = _.sortBy(systems.data.filter((system) => {
  return system.population !== null;
}).map((system) => {
  system.distance = distance(system, args);
  return system;
}), 'distance');

let closest = distances.slice(0, 10);

console.log(closest);

//console.log(loops.reduce((max, loop) => {
//  let profit = loop.deal.netIncome + loop.returnTrips
//}, 0))
