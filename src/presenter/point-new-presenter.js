import EditPointView from '../view/edit-point-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';

const generateBlankPoint = () => ({
  basePrice: Number(),
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
  newPoint: true
});

export default class PointNewPresenter {
  #tripListContainer = null;
  #editPointComponent = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(tripListContainer, changeData) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
  }

  init = (callback, allDestinations, allOffers) => {
    this.#destroyCallback = callback;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView(generateBlankPoint(), allDestinations, allOffers);

    this.#editPointComponent.setEditFormSubmitHandler(this.#handleEditFormSubmit);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editPointComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editPointComponent === null) {
      return;
    }
    this.#destroyCallback?.();
    remove(this.#editPointComponent);
    this.#editPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleEditFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };
}


