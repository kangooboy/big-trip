import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class PointPresenter {
  #tripListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #changeData = null;

  constructor(tripListContainer, changeData) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new EditPointView(point);

    this.#pointComponent.setEditClickHandler(this.#replacePointToEdit);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editPointComponent.setEditFormClickHandler(this.#replaceEditToPoint);
    this.#editPointComponent.setEditFormSubmitHandler(this.#handleEditFormSubmit);

    if(prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#tripListContainer);
      return;
    }

    if(this.#tripListContainer.contains(prevEditPointComponent.element)) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    if(this.#tripListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #replacePointToEdit = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceEditToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToPoint();
    }
  };

  #handleEditFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditToPoint();
  };
}
