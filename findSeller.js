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

if (args.commodity) {
  COMMODITY = commodities.findByName(args.commodity);
  if (!COMMODITY)
    throw new Error('Couldn\'t find ' + args.commodity);
}
else
  throw new Error('You need to specify a --commodity="Commodity Name"');

let findBuyer = () => {
  let adjacentSystems = systems.adjacent(SYSTEM, LY);

  let adjacentStations = adjacentSystems.reduce((_stations, system) => {
    return _stations.concat(stations.inSystem(system));
  }, []);

  let buyers = adjacentStations.filter((station) => {
    return station.listings
      && station.distance_to_star < 1000
      && station.max_landing_pad_size === 'L'
      && station.listings.filter((listing) => {
        return listing.commodity_id === COMMODITY.id
          && listing.buy_price > 0;
      }).length;
  }).map((station) => {
    let buyerListing = _.findWhere(station.listings, {
      commodity_id: COMMODITY.id
    });
    return {
      station: station.name,
      system: systems.findById(station.system_id).name,
      price: buyerListing.buy_price
    }
  });

  console.log(_.sortBy(buyers, 'price').reverse());

}

findBuyer();
