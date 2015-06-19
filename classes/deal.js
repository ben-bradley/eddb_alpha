var Commodities = require('./commodities'),
  distance = require('../util/distance'),
  _ = require('lodash');

var commodities = new Commodities();

class Deal {
  constructor(options) {

    let {
      buyer,
      buyerSystem,
      seller,
      sellerSystem,
      listing,
      cargo,
      cash
    } = options;

    let query = {
      commodity_id: listing.commodity_id
    }

    let buyerListing = _.findWhere(buyer.listings, query);

    let sellerListing = _.findWhere(seller.listings, query);

    if (!sellerListing || !buyerListing)
      return;

    let paid = sellerListing.buy_price, // I paid
      sold = buyerListing.sell_price; // I sold

    if (sellerListing.supply === 0 || paid === 0)
      return;

    if (buyerListing.demand === 0 || sold === 0)
      return;

    let travel = {
      ly: distance(sellerSystem, buyerSystem),
      ls: findLs(seller, buyer)
    }

    let cost = 0;
    let quantity = 0;
    while (cash > cost && cargo > quantity) {
      quantity += 1;
      cost += paid;
    };

    let commodity = commodities.findById(listing.commodity_id);
    if (commodity)
      this.commodity = commodity.name;

    this.from = {
      station: seller.name,
      system: sellerSystem.name
    }

    this.to = {
      station: buyer.name,
      system: buyerSystem.name
    }

    this.quantity = quantity;
    this.income = this.quantity * sold;
    this.cost = cost;
    this.netIncome = this.income - this.cost;
    this.profitPerDistance = (travel.ls) ? this.netIncome / travel.ls : 0;

  }
}

let findLs = (seller, buyer) => {
  if (!seller || !buyer)
    return 0;
  else if (!seller.distance_to_star || !buyer.distance_to_star)
    return 0;
  return seller.distance_to_star + buyer.distance_to_star;
}

module.exports = Deal;

/**
buy_price is what I pay
sell_price is what the station pays
**/

/*
      let deal = {
        buyFrom: {
          name: nextStation.name,
          id: nextStation.id,
          listing: listing
        },
        sellTo: {
          name: highestBidder.name,
          id: highestBidder.id,
          listing: _.findWhere(highestBidder.listings, {
            commodity_id: listing.commodity_id
          })
        },
        commodity: commodities.findById(listing.commodity_id)
      };

      deal.profit = deal.sellTo.listing.buy_price - deal.buyFrom.listing.sell_price;
*/
