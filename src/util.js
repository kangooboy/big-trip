import dayjs from 'day.js';

const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const humanizeDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

export { getRandomInt, humanizeDueDate };
