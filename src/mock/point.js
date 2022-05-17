import { generateDestination } from './destination.js';
import { generateOffer } from './offer.js';
import { getRandomInt } from '../util.js';
import { humanizeDueDate } from '../util.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

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

  const { offers, type } = generateOffer();
  return {
    basePrice: getRandomInt(100, 1000),
    dateFrom: humanizeDueDate(generateDate()),
    dateTo: humanizeDueDate(dayjs()),
    destination: generateDestination().name,
    id: nanoid(),
    isFavorite: false,
    offers,
    type
  };
};
