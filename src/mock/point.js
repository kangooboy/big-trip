import { generateDestination } from './destination.js';
import { generateOffer } from './offer.js';
import { getRandomInt } from '../util.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { randomHour, randomMinutes  } from '../util.js';

const generateDate = () => {
  const isDate = Boolean(getRandomInt(0,1));
  if(!isDate) {
    generateDate();
  }
  const maxDayGap = 7;
  const daysGap = getRandomInt(-maxDayGap, -1);
  return dayjs().add(daysGap, 'day').toDate();
};

export const generatePoint = () => {
  const [hourFrom, hourTo] = randomHour();
  const [minutesFrom, minutesTo] = randomMinutes();
  const randomDate = generateDate();
  const dateFrom = dayjs(randomDate).format(`YYYY-MM-DDT${hourFrom}:${minutesFrom}`);
  const dateTo = dayjs(randomDate).format(`YYYY-MM-DDT${hourTo}:${minutesTo}`);

  const { offers, type } = generateOffer();
  return {
    basePrice: getRandomInt(100, 1000),
    dateFrom,
    dateTo,
    destination: generateDestination().name,
    id: nanoid(),
    isFavorite: false,
    offers,
    type
  };
};
