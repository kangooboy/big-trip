import { createElement } from '../render.js';

const createTripListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripListView {
  #element = null;

  get template() {
    return createTripListTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
