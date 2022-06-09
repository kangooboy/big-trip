import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

const createDestination = (name, allDestinations) => {
  const destination = allDestinations.find((element) => element.name === name);
  return (destination) ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${createDestinationImage(destination)}
    </section>` : '';
};

const createDestinationList = (names) => names.reduce((prev, curr) => `${prev}
<option value="${curr.name}"></option>`, '');

const createOfferButtonsTemplate = (type, offers, allOffers, newPoint) => {
  const offerIndex = allOffers.findIndex((item) => item.type === type);
  const targetOffers = allOffers[offerIndex].offers;

  return targetOffers.reduce((prev, curr) => {
    const { title, price, id } = curr;
    return `${prev}
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" 
          type="checkbox" data-id=${curr.id} name="event-offer-${type}" 
          ${(offers.some((item) => item === id) && !newPoint) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${type}-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  }, '');
};

const createOfferContainer = (type, offers, allOffers, newPoint) => (offers !== []) ? (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${(createOfferButtonsTemplate(type, offers, allOffers, newPoint))}
    </div>
  </section>`) : '';

const createTypeOfPoint = (offers) => offers.reduce((prev, curr) => `${prev}
  <div class="event__type-item">
    <input id="event-type-${curr.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${curr.type}">
    <label class="event__type-label  event__type-label--${curr.type}" for="event-type-${curr.type}-1">${curr.type}</label>
  </div>`, '');

const createEditPointTemplate = (data, allDestinations, allOffers) => {
  const { basePrice, destination, type, offers, dateFrom, dateTo, newPoint, isDisabled, isSaving, isDeleting } = data;
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
            name="event-destination" ${(destination) ? `value=${destination.name}` : 'placeholder="choose target city"'} list="destination-list-1" required>
            <datalist id="destination-list-1">
              ${createDestinationList(allDestinations)}
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
            name="event-price" value="${basePrice}" pattern="^[1-9]+[0-9]*$" required>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
    ${(() => {
      if(newPoint) {
        return 'Cancel';
      } if(isDeleting) {
        return 'Deleting...';
      } else {
        return 'Delete';
      }
    })()}
          </button>
          
          ${(newPoint) ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
        </header>
        <section class="event__details">
          ${createOfferContainer(type, offers, allOffers, newPoint)}
          ${createDestination(destination.name, allDestinations)}
        </section>
      </form>
    </li>`
  );
};

export default class EditPointView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;
  #allDestinations = null;
  #allOffers = null;

  constructor(point, allDestinations, allOffers) {
    super();
    this._state = EditPointView.parsePointToState(point);
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#allDestinations, this.#allOffers);
  }

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom || this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();
      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parsePointToState(point)
    );
  };

  setEditFormClickHandler = (callback) => {
    if(this._state.newPoint) {
      return;
    }
    this._callback.editFormClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editFormClick);
  };

  setEditFormSubmitHandler = (callback) => {
    this._callback.editFormSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#editFormSubmit);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #editFormClick = (evt) => {
    evt.preventDefault();
    this._callback.editFormClick();
  };

  #editFormSubmit = (evt) => {
    evt.preventDefault();
    this._callback.editFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #changeTypePoint = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    const targetPoint = this.#allOffers.find((item) => item.type === evt.target.value);
    const targetOffersId = targetPoint.offers.map((item) => item.id);
    this.updateElement({
      type: targetPoint.type,
      offers: targetOffersId
    });
  };

  #changeDestination = (evt) => {
    if(evt.target.tagName !== 'INPUT' || evt.target.value === '') {
      return;
    }
    const targetDestination = this.#allDestinations.find((element) => element.name === evt.target.value);
    this.updateElement({
      destination: targetDestination
    });
  };

  #changePrice = (evt) => {
    if(evt.target.tagName !== 'INPUT' || isNaN(Number(evt.target.value)) || Number(evt.target.value) <= 0) {
      return;
    }
    this._setState({
      basePrice: evt.target.value
    });
  };

  #checkOffer = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    const offerId = evt.target.dataset.id;
    const offers = [...this._state.offers];
    if(offers.some((item) => item === Number(offerId))) {
      const offerIndex = offers.findIndex((item) => item === Number(offerId));
      offers.splice(offerIndex, 1);
    } else {
      offers.push(Number(offerId));
    }
    this._setState({
      offers: offers
    });
  };

  static parsePointToState = (point) => Object.assign({
    isDisabled: false,
    isSaving: false,
    isDeleting: false,},
  point);

  static parseStateToPoint = (state) => {
    const point = JSON.parse(JSON.stringify(state));
    point.basePrice = Number(point.basePrice);
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    if(point.newPoint) {
      delete point.newPoint;
    }
    return point;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#changeTypePoint);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestination);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePrice);
    if(this.element.querySelector('.event__section--offers') !== null) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#checkOffer);
    }
    this.#setDatepicker();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setEditFormClickHandler(this._callback.editFormClick);
    this.setEditFormSubmitHandler(this._callback.editFormSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.#setDatepicker();
  };

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo
    });
  };

  #setDatepicker = () => {
    if (!this._state.dateFrom || !this._state.dateTo) {
      return;
    }
    const flatpickrOption = {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
    };
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        ...flatpickrOption,
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        ...flatpickrOption,
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };
}
