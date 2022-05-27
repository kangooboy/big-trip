import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { destinations } from '../mock/destination.js';
import { allOffers } from '../mock/offer.js';
import dayjs from 'dayjs';

const createDestinationImage = (destination) => {
  const { pictures } = destination;
  const createImages = (images) => images.reduce((prev, curr) => `${prev}
      <img class="event__photo" src="${curr.src}" alt="${curr.description}"></img>`, '');

  return (pictures !== []) ? (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createImages(pictures)}
      </div>
    </div>`
  ) : '';
};

const createDestination = (name) => {
  const destination = destinations.find((element) => element.name === name);
  return (destination) ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${createDestinationImage(destination)}
    </section>` : '';
};

const createDestinationList = (names) => names.reduce((prev, curr) => `${prev}
<option value="${curr.name}"></option>`, '');

const createOfferButtonsTemplate = (type, offers) => {
  const offerIndex = allOffers.findIndex((item) => item.type === type);
  const targetOffers = allOffers[offerIndex].offers;
  return targetOffers.reduce((prev, curr) => {
    const { title, price, id } = curr;
    return `${prev}
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" 
          type="checkbox" data-id=${curr.id} name="event-offer-${type}" ${(offers.some((item) => item === id)) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${type}-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  }, '');
};

const createOfferContainer = (type, offers) => (offers !== []) ? (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${(createOfferButtonsTemplate(type, offers))}
    </div>
  </section>`) : '';

const createTypeOfPoint = (offers) => offers.reduce((prev, curr) => `${prev}
  <div class="event__type-item">
    <input id="event-type-${curr.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${curr.type}">
    <label class="event__type-label  event__type-label--${curr.type}" for="event-type-${curr.type}-1">${curr.type}</label>
  </div>`, '');

const createEditPointTemplate = (data) => {
  const { basePrice, destination, type, offers, dateFrom, dateTo } = data;
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypeOfPoint(allOffers)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" 
            name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationList(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" 
            name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YYYY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" 
            name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YYYY HH:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" 
            name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOfferContainer(type, offers)}
          ${createDestination(destination)}
        </section>
      </form>
    </li>`
  );
};

export default class EditPointView extends AbstractStatefulView {
  constructor(point) {
    super();
    this._state = EditPointView.parsePointToState(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  reset = (point) => {
    this.updateElement(
      EditPointView.parsePointToState(point)
    );
  };

  setEditFormClickHandler = (callback) => {
    this._callback.editFormClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editFormClick);
  };

  setEditFormSubmitHandler = (callback) => {
    this._callback.editFormSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#editFormSubmit);
  };

  #editFormClick = (evt) => {
    evt.preventDefault();
    this._callback.editFormClick();
  };

  #editFormSubmit = (evt) => {
    evt.preventDefault();
    this._callback.editFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #changeTypePointChange = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    const targetPoint = allOffers.find((item) => item.type === evt.target.value);
    this.updateElement({
      type: targetPoint.type,
      offers: targetPoint.offers
    });
  };

  #changeDestination = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    const targetDestination = destinations.find((element) => element.name === evt.target.value);
    this.updateElement({
      destination: targetDestination.name
    });
  };

  #checkOffer = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    const offerId = evt.target.dataset.id;
    const offers = this._state.offers.slice();
    if(offers.some((item) => item === Number(offerId))) {
      const offerIndex = offers.findIndex((item) => item === Number(offerId));
      offers.splice(offerIndex, 1);
    } else {
      offers.push(Number(offerId));
    }
    this._setState({
      offers: [...offers]
    });
  };

  static parsePointToState = (point) => {
    const copyPoint = JSON.parse(JSON.stringify(point));
    return copyPoint;
  };

  static parseStateToPoint = (state) => {
    const point = JSON.parse(JSON.stringify(state));
    return point;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#changeTypePointChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestination);
    if(this.element.querySelector('.event__section--offers') !== null) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#checkOffer);
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setEditFormClickHandler(this._callback.editFormClick);
    this.setEditFormSubmitHandler(this._callback.editFormSubmit);
  };
}
