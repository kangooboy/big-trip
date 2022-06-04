import AbstractView from '../framework/view/abstract-view.js';

const createNewPointTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointButtonView extends AbstractView {
  get template() {
    return createNewPointTemplate();
  }

  setNewPointClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#newPointClickHandler);
  };

  #newPointClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

