let args = require('argify'),
  _ = require('lodash');

let Systems = require('./classes/systems'),
  Stations = require('./classes/stations'),
  Deal = require('./classes/deal');

let systems = new Systems(),
  stations = new Stations();

let system,
  ly = 0,
  cargo = 0,
  cash = 0,
  sort = args.sort || 'profit';

if (args.id)
  system = systems.findById(Number(args.id));
else if (args.name)
  system = systems.findByName(args.name);
else
  throw new Error('You need to specify a system --name or an --id');

ly = args.ly;
if (!ly)
  throw new Error('You need to specify a --ly argument');

cargo = args.cargo;
if (!cargo)
  throw new Error('You need to specify a --cargo argument');

cash = args.cash;
if (!cash)
  throw new Error('You need to specify a --cash argument');

let findDeals = (system, ly) => {
  let adjacentSystems = systems.adjacent(system, ly);
  let adjacentStations = _.flatten(adjacentSystems.map(system => {
      return stations.inSystem(system);
    }))
    .filter(stationFilter)
    .concat(stations.inSystem(system).filter(stationFilter));

  let deals = [];

  for (var s in adjacentStations) {
    let nextStation = adjacentStations[s];
    for (var l in nextStation.listings) {
      let listing = nextStation.listings[l];
      for (var s in adjacentStations) {
        let station = adjacentStations[s];
        let deal = new Deal({
          buyer: nextStation,
          buyerSystem: systems.findById(nextStation.system_id),
          seller: station,
          sellerSystem: systems.findById(station.system_id),
          listing,
          cargo,
          cash
        });
        deals.push(deal);
      }
    }
  }

  return _.sortBy(deals, sort).reverse().filter(profitable);
}

let profitable = (deal) => {
  return deal.netIncome && deal.netIncome > 0
}

let stationFilter = (station) => {
  return station.listings.length && station.distance_to_star < 1000;
}

let deals = findDeals(system, ly)

let loops = deals.map(deal => {
  let tripB = _.sortBy(_.filter(deals, {
    from: {
      station: deal.to.station,
      system: deal.to.system
    },
    to: {
      station: deal.from.station,
      system: deal.from.system
    }
  }), 'profit')[0];


  return {
    tripA: deal,
    tripB: tripB,
    tripNetIncome: (tripB) ? deal.netIncome + tripB.netIncome : 0
  }
})

console.log(_.sortBy(loops, 'tripNetIncome').reverse()[0])

//console.log(loops.reduce((max, loop) => {
//  let profit = loop.deal.netIncome + loop.returnTrips
//}, 0))
