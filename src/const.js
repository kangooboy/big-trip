const FilterType = {
  EVERYTHING: 'everthing',
  FUTURE: 'future',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export { FilterType, SortType, UpdateType, UserAction };
