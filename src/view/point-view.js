import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { calculateTimeDifference } from '../util.js';

const createOffer = (offers, type, allOffers) => {
  const offerIndex = allOffers.findIndex((item) => item.type === type);
  const targetOffers = allOffers[offerIndex].offers.filter((item) => offers.some((el) => el === item.id));
  return targetOffers.reduce((prev, curr) => {
    const { title, price} = curr;
    return`${prev}
      <li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
  }, '');
};

const createPointTemplate = (point, allOffers) => {
  const { basePrice, destination, offers, type, dateFrom, dateTo, isFavorite } = point;

  const createHeaderOfferListTemplate = () => (offers !== []) ?
    `<h4 class="visually-hidden">Offers:</h4>
     <ul class="event__selected-offers">${createOffer(offers, type, allOffers)}</ul>` : '';

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('D MMMM')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${dayjs(dateFrom).format('HH:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${dayjs(dateTo).format('HH:mm')}</time>
          </p>
          <p class="event__duration">${calculateTimeDifference(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${createHeaderOfferListTemplate()}
        <button class="${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointView extends AbstractView {
  #point = null;
  #allOffers = null;

  constructor(point, allOffers) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#allOffers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}

