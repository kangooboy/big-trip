import dayjs from 'dayjs';

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if(index === -1) {
    return items;
  }
  return [...items.slice(0, index), update, ...items.slice(index + 1),];
};

const calculateTimeDifference = (dateFrom, dateTo) => {

  let days = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  let hours = dayjs(dateTo).diff(dayjs(dateFrom), 'hours');
  hours -= days * 24;
  const allInMinutes = dayjs(dateTo).diff(dateFrom, 'minutes');
  let minutes = allInMinutes % 60;

  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  hours = (hours < 10) ? `0${hours}` : hours;
  days = (days < 10) ? `0${days}` : days;

  if(days === '00') {
    days = '';
  } else {
    days += 'D';
  }
  if(hours === '00') {
    return `${minutes}M`;
  }
  if(minutes === '00') {
    return `${hours}H`;
  }
  return `${days} ${hours}H ${minutes}M`;
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

export { getRandomInt, updateItem,  randomRangeHours, randomRangeMinutes, calculateTimeDifference, sortByDay, sortByTime, sortByPrice};
