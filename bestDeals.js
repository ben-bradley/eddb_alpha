let args = require('argify'),
  _ = require('lodash');

let Systems = require('./classes/systems'),
  Stations = require('./classes/stations'),
  Commodities = require('./classes/commodities');

let systems = new Systems(),
  stations = new Stations(),
  commodities = new Commodities();

let SYSTEM, STATION, LY, COMMODITY;

if (args.system) {
  SYSTEM = systems.findByName(args.system);
  if (!SYSTEM)
    throw new Error('Couldn\'t find ' + args.system);
}
else
  throw new Error('You need to specify a --system="System Name"');

if (args.station) {
  STATION = stations.findByName(args.station);
  if (!STATION)
    throw new Error('Couldn\'t find ' + args.station);
}
else
  throw new Error('You need to specify a --station="Station Name"');

if (args.ly)
  LY = args.ly;
else
  throw new Error('You need to specify a --ly argument');

let findBuyer = () => {
  let adjacentSystems = systems.adjacent(SYSTEM, LY);

  let adjacentStations = adjacentSystems.reduce((_stations, system) => {
    return _stations.concat(stations.inSystem(system));
  }, []).filter((station) => {
    return station.listings
      && station.distance_to_star < 1000
      && station.max_landing_pad_size === 'L';
  });

  let deals = [];

  STATION.listings.filter((listing) => {
    return listing.supply > 0
      && listing.buy_price;
  }).forEach((listing) => {
    adjacentStations.forEach((station) => {
      let _listing = _.findWhere(station.listings, {
        commodity_id: listing.commodity_id
      });
      if (!_listing || !_listing.demand || !_listing.sell_price)
        return;
      let profit = _listing.sell_price - listing.buy_price;
      if (profit < 1)
        return;
      deals.push({
        commodity: commodities.findById(listing.commodity_id).name,
        from: {
          station: STATION.name,
          system: SYSTEM.name
        },
        to: {
          station: station.name,
          system: systems.findById(station.system_id).name
        },
        profit
      })
    })
  })

  console.log(_.sortBy(deals, 'profit'));

}

findBuyer();
