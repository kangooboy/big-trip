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
        src: 'http://picsum.photos/248/152?r=0.0762563345163317',
        description: 'Amsterdam parliament building'
      }
    ]
  },
  {
    description: 'Geneva is one of the largest cities in Switzerland and one of the most beautiful cities in Europe',
    name: 'Geneva',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762546005843317',
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
