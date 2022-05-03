import { getRandomInt} from '../util.js';

const offers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Order Uber',
        price: 20
      }
    ]
  },
  {
    type: 'bus',
    offers: []
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      }, {
        id: 2,
        title: 'Choose seats',
        price: 5
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      }, {
        id: 2,
        title: 'Add meal',
        price: 15
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Rent a car',
        price: 200
      }, {
        id: 2,
        title: 'Travel by train',
        price: 40
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Add luggage',
        price: 30
      }, {
        id: 2,
        title: 'Switch to comfort class',
        price: 100
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'Add breakfast',
        price: 50
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 1,
        title: 'Book tickets',
        price: 40
      }, {
        id: 2,
        title: 'Lunch in city',
        price: 30
      }
    ]
  },
  {
    type: 'restaurant',
    offers: []
  },
];

export const generateOffer = () => {
  const randomIndex = getRandomInt(0, offers.length - 1);
  return offers[randomIndex];
};
