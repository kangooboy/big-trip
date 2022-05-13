import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filters) => filters.reduce((prev, curr) =>{
  const filter = curr;
  const filterToUpperCase = filter.charAt(0).toUpperCase() + filter.slice(1);
  return `${prev}
    <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filterToUpperCase}</label>
    </div>`;
}, '');

const createFilterPointTemplate = (filters) => (
  `<form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterPointView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterPointTemplate(this.#filters);
  }
}

