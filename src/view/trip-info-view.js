import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTemplate = (title, date, cost) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${date}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #title = null;
  #date = null;
  #cost = null;

  constructor(title, date, cost) {
    super();
    this.#title = title;
    this.#date = date;
    this.#cost = cost;
  }

  get template() {
    return createTripInfoTemplate(this.#title, this.#date, this.#cost);
  }
}
