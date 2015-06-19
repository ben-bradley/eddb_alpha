let args = require('argify'),
  _ = require('lodash'),
  distance = require('./util/distance');

let Systems = require('./classes/systems'),
  Stations = require('./classes/stations'),
  Commodities = require('./classes/commodities');

let systems = new Systems(),
  stations = new Stations(),
  commodities = new Commodities();

let SYSTEM, LY;

if (args.system) {
  SYSTEM = systems.findByName(args.system);
  if (!SYSTEM)
    throw new Error('Couldn\'t find ' + args.system);
}
else
  throw new Error('You need to specify a --system="System Name"');

if (args.ly)
  LY = args.ly;
else
  throw new Error('You need to specify a --ly argument');

let findProfit = () => {
  let adjacentSystems = systems.adjacent(SYSTEM, LY);

  let adjacentStations = adjacentSystems.reduce((_stations, system) => {
    return _stations.concat(stations.inSystem(system));
  }, []).filter((station) => {
    return station.listings
      && station.distance_to_star < 1000
      && station.max_landing_pad_size === 'L';
  });

  let deals = [];

  // seller = station that sells commodity to you
  // buyer = station that buys commodity from you

  adjacentStations.forEach((seller) => {
    seller.listings.filter((seller_listing) => {
      return seller_listing.supply > 0 && seller_listing.buy_price;
    }).forEach((seller_listing) => {
      adjacentStations.forEach((buyer) => {
        let buyer_listing = _.findWhere(buyer.listings, {
          commodity_id: seller_listing.commodity_id
        })
        if (!buyer_listing)
          return;

        let profit = buyer_listing.sell_price - seller_listing.buy_price;
        if (profit < 1500)
          return;

        let seller_system = systems.findById(seller.system_id),
          buyer_system = systems.findById(buyer.system_id);

        deals.push({
          commodity: commodities.findById(seller_listing.commodity_id).name,
          from: {
            station: seller.name,
            system: seller_system.name,
            ls: seller.distance_to_star
          },
          to: {
            station: buyer.name,
            system: buyer_system.name,
            ls: buyer.distance_to_star
          },
          distance: distance(seller_system, buyer_system),
          profit: profit
        })
      })
    })
  })

  if (!args.loop)
    return console.log(_.sortBy(deals, 'profit'));

  let loops = [];

  deals.reverse().forEach((deal) => {
    let laed = _.find(deals, (d) => {
      return d.from.station === deal.to.station
        && d.from.system === deal.to.system
        && d.to.station === deal.from.station
        && d.to.system === deal.from.system;
    })
    if (!laed)
      return;
    loops.push({
      legA: deal,
      legB: laed,
      profit: deal.profit + laed.profit
    })
  })

  _.sortBy(loops, 'profit').forEach((loop) => {
    console.log(loop);
  })

}

findProfit();


