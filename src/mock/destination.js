import { getRandomInt} from '../util.js';

const destinations = [
  {
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    description: 'The beauty of Amsterdam is built around intricate canals, breathtaking architecture, and modern technology. ',
    name: 'Amsterdam',
    pictures: [
      {
        src: 'https://www.outsourcing-pharma.com/var/wrbm_gb_food_pharma/storage/images/_aliases/wrbm_large/1/9/4/7/3257491-3-eng-GB/Japan-to-be-hot-destination-for-trials-in-2015-say-experts-despite-drop-in-MRCTs-last-year.jpg',
        description: 'Amsterdam parliament building'
      }
    ]
  },
  {
    description: 'Geneva is one of the largest cities in Switzerland and one of the most beautiful cities in Europe',
    name: 'Geneva',
    pictures: [
      {
        src: 'https://www.outsourcing-pharma.com/var/wrbm_gb_food_pharma/storage/images/_aliases/wrbm_large/7/2/3/8/1358327-1-eng-GB/Catalent-to-open-Japanese-development-lab.jpg',
        description: 'Geneva parliament building'
      }
    ]
  },
];

export const generateDestination = () => {
  const randomIndex = getRandomInt(0, destinations.length - 1);
  return destinations[randomIndex];
};

export { destinations };
