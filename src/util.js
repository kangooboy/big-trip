import dayjs from 'dayjs';
import { FilterType } from './const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(point.dateFrom, 'D')),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(point.dateFrom, 'D'))
};

const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomRange = (int1, int2) => {
  let from = Math.min(int1, int2);
  from = (from < 10) ? `0${from}` : from;
  let to = Math.max(int1, int2);
  to = (to < 10) ? `0${to}` : to;
  return [`${from}`, `${to}`];
};

const randomRangeHours = () => {
  const int1 = getRandomInt(0, 23);
  const int2 = getRandomInt(0, 23);
  return randomRange(int1, int2);
};

const randomRangeMinutes = () => {
  const int1 = getRandomInt(1, 59);
  const int2 = getRandomInt(1, 59);
  return randomRange(int1, int2);
};

const calculateTimeDifference = (dateFrom, dateTo) => {

  const daysCount = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  let hoursCount = dayjs(dateTo).diff(dayjs(dateFrom), 'hours');
  hoursCount -= daysCount * 24;
  const allInMinutes = dayjs(dateTo).diff(dateFrom, 'minutes');
  const minutesCount = allInMinutes % 60;

  const getMinutes = () => {
    if(minutesCount === 0) {
      return '00M';
    }
    return (minutesCount < 10) ? `0${minutesCount}M` : `${minutesCount}M`;
  };

  const getHours = () => {
    if(daysCount === 0 && hoursCount === 0 && minutesCount !== 0) {
      return '';
    }
    if(daysCount !== 0 && hoursCount === 0 && minutesCount !== 0) {
      return '00H';
    }
    return (hoursCount < 10) ? `0${hoursCount}H` : `${hoursCount}H`;
  };

  const getDays = () => {
    if(hoursCount === 0 && daysCount === 0 && minutesCount === 0) {
      return '00D';
    }
    if(daysCount === 0) {
      return '';
    }
    return (daysCount < 10) ? `0${daysCount}D` : `${daysCount}D`;
  };

  return `${getDays()} ${getHours()} ${getMinutes()}`;
};

const sortByDay = (a, b) => {
  a = dayjs(a.dateFrom);
  b = dayjs(b.dateFrom);
  return a - b;
};

const sortByTime = (a, b) => {
  a = dayjs(a.dateTo).diff(a.dateFrom, 'hours');
  b = dayjs(b.dateTo).diff(b.dateFrom, 'hours');
  return  b - a;
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export { filter, getRandomInt, randomRangeHours, randomRangeMinutes, calculateTimeDifference, sortByDay, sortByTime, sortByPrice};
