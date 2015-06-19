let args = require('argify'),
  _ = require('lodash');

let Systems = require('./classes/systems'),
  Stations = require('./classes/stations'),
  Commodities = require('./classes/commodities');

let systems = new Systems(),
  stations = new Stations(),
  commodities = new Commodities();

let SYSTEM,
  STATION,
  LY = 0,
  CARGO = 0,
  CASH = 0,
  sort = args.sort || 'profitTotal';

if (args.system)
  SYSTEM = systems.findByName(args.system);
else
  throw new Error('You need to specify a --system="System Name"');

if (args.station)
  STATION = stations.findByName(args.station);
else
  throw new Error('You need to specify a --station="Station Name"');

LY = args.ly;
if (!LY)
  throw new Error('You need to specify a --ly argument');

CARGO = args.cargo;
if (!CARGO)
  throw new Error('You need to specify a --cargo argument');

CASH = args.cash;
if (!CASH)
  throw new Error('You need to specify a --cash argument');

let findDeals = () => {
  let adjacentSystems = systems.adjacent(SYSTEM, LY);
  let adjacentStations = _.flatten(adjacentSystems.map(system => {
      return stations.inSystem(system);
    }))
    .filter(stationFilter)
    .concat(stations.inSystem(SYSTEM).filter(stationFilter));

  console.log('station: ' + STATION.name);

  console.log('Found ' + adjacentSystems.length + ' systems and ' + adjacentStations.length + ' stations');

  let deals = [];

  let listings = STATION.listings.filter((listing) => {
    return true;
//    return listing.supply > 0;
  })

  for (var l in listings) {
    let listing = listings[l],
      commodity = commodities.findById(listing.commodity_id);
    console.log('checking: ' + commodity.name)
    for (var s in adjacentStations) {
      let station = adjacentStations[s];
      if (!station.listings)
        continue;
      let buyerListing = _.findWhere(station.listings, {
        commodity_id: listing.commodity_id
      });
      if (!buyerListing)
        continue;
      let profitEach = buyerListing.sell_price - listing.buy_price;
      if (profitEach < 0)
        continue;
      let deal = {
        commodity: commodity.name,
        from: {
          station: STATION.name,
          system: SYSTEM.name
        },
        to: {
          station: station.name,
          system: systems.findById(station.system_id).name
        },
        profitEach,
        profitTotal: profitEach * CARGO
      };
      deals.push(deal);
    }
  }

  return _.sortBy(deals, 'profitTotal').reverse();
}


let stationFilter = (station) => {
  return station.listings.length && station.distance_to_star < 1000 && station.max_landing_pad_size === 'L';
}

let deals = findDeals()

console.log(deals.filter(deal => {
  return true;
//  return deal.commodity === 'Palladium'
//    || deal.commodity === 'Silver'
//    || deal.commodity === 'Gold'
}).slice(0, 2));
