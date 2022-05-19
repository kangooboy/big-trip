import dayjs from 'dayjs';

const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomHour = () => {
  const int1 = getRandomInt(0, 24);
  const int2 = getRandomInt(0, 24);
  let hourFrom = Math.min(int1, int2);
  hourFrom = (hourFrom < 10) ? `0${hourFrom}` : hourFrom;
  let hourTo = Math.max(int1, int2);
  hourTo = (hourTo < 10) ? `0${hourTo}` : hourTo;
  return [`${hourFrom}`, `${hourTo}`];
};

const randomMinutes = () => {
  const int1 = getRandomInt(1, 59);
  const int2 = getRandomInt(1, 59);
  let minutesFrom = Math.min(int1, int2);
  minutesFrom = (minutesFrom < 10) ? `0${minutesFrom}` : minutesFrom;
  let minutesTo = Math.max(int1, int2);
  minutesTo = (minutesTo < 10) ? `0${minutesTo}` : minutesTo;
  return [`${minutesFrom}`, `${minutesTo}`];
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if(index === -1) {
    return items;
  }
  return [...items.slice(0, index), update, ...items.slice(index + 1),];
};

const calculateTimeDifference = (dateFrom, dateTo) => {

  const allInMinutes = dayjs(dateTo).diff(dateFrom, 'minutes');
  let minutes = allInMinutes % 60;
  let hours = (allInMinutes - minutes) / 60;

  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  hours = (hours < 10) ? `0${hours}` : hours;

  if(hours === '00') {
    return `${minutes}M`;
  }
  if(minutes === '00') {
    return `${hours}H`;
  }else {
    return `${hours}H ${minutes}M`;
  }
};

const sortByDay = (a, b) => {
  a = dayjs(a.dateFrom).format('DD');
  b = dayjs(b.dateFrom).format('DD');
  return b - a;
};

const sortByTime = (a, b) => {
  a = dayjs(a.dateTo).diff(a.dateFrom, 'hours');
  b = dayjs(b.dateTo).diff(b.dateFrom, 'hours');
  return  b - a;
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export { getRandomInt, updateItem, randomHour, randomMinutes, calculateTimeDifference, sortByDay, sortByTime, sortByPrice};
