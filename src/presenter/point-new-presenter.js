// import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNewPresenter {
  #tripListContainer = null;
  #editPointComponent = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(tripListContainer, changeData) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView();

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
    this.destroy();
  };
}


