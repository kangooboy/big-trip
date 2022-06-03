import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filters, currentFilter) => filters.reduce((prev, curr) => {
  const { type, points } = curr;
  return `${prev}
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" 
      type="radio" name="trip-filter" value="${type}" 
      ${type === currentFilter ? 'checked' : ''}
      ${points.length === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
}, '');

const createFilterPointTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filters, currentFilter)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterPointView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterPointTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.filterTypeChange(evt.target.value);
  };
}

