import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};


const createNoPointTemplate = (filterType) => {
  const noPointTextValue = NoPointTextType[filterType];
  return (`<p class="trip-events__msg">${(noPointTextValue) ? noPointTextValue : 'No data'}</p>`);
};

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
