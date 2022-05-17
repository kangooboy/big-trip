import dayjs from 'dayjs';

const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const humanizeDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if(index === -1) {
    return items;
  }
  return [...items.slice(0, index), update, ...items.slice(index + 1),];
};

export { getRandomInt, humanizeDueDate, updateItem };
