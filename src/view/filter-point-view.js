import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filters, pointsCount) => filters.reduce((prev, filter, index) =>`${prev}
  <div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" 
    type="radio" name="trip-filter" value="${filter}" 
    ${index === 0 ? 'checked' : ''}
    ${pointsCount === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>`,
'');

const createFilterPointTemplate = (filters, pointsCount) => (
  `<form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filters, pointsCount)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterPointView extends AbstractView {
  #filters = null;
  #pointsCount = null;

  constructor(filters, pointsCount) {
    super();
    this.#filters = filters;
    this.#pointsCount = pointsCount;
  }

  get template() {
    return createFilterPointTemplate(this.#filters, this.#pointsCount);
  }
}

