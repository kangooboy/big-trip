import { generateDestination } from './destination.js';
import { generateOffer } from './offer.js';
import { getRandomInt } from '../util.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { randomRangeHours, randomRangeMinutes  } from '../util.js';

const generateDate = () => {
  const isDate = Boolean(getRandomInt(0,1));
  if(!isDate) {
    generateDate();
  }
  const daysGap = getRandomInt(-7, 7);
  return dayjs().add(daysGap, 'day').toDate();
};

export const generatePoint = () => {
  const [hourFrom, hourTo] = randomRangeHours();
  const [minutesFrom, minutesTo] = randomRangeMinutes();
  const randomDate1 = generateDate();
  const randomDate2 = generateDate();
  const randomDateFrom = (randomDate1.getTime() > randomDate2.getTime()) ? randomDate2 : randomDate1;
  const randomDateTo = (randomDate1.getTime() > randomDate2.getTime()) ? randomDate1 : randomDate2;
  const dateFrom = dayjs(randomDateFrom).format(`YYYY-MM-DDT${hourFrom}:${minutesFrom}:ss.sss[Z]`);
  const dateTo = dayjs(randomDateTo).format(`YYYY-MM-DDT${hourTo}:${minutesTo}:ss.sss[Z]`);
  const { offers, type } = generateOffer();

  return {
    basePrice: getRandomInt(100, 1000),
    dateFrom,
    dateTo,
    destination: generateDestination().name,
    id: nanoid(),
    isFavorite: false,
    offers: offers.map((item) => item.id),
    type
  };
};
