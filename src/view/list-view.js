import { createElement } from '../render.js';

const createListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class ListView {
  getTemplate() {
    return createListTemplate;
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
