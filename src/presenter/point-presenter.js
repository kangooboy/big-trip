import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

export default class PointPresenter {
  #tripListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(tripListContainer, changeData, changeMode) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, allDestinations, allOffers) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point, allOffers);
    this.#editPointComponent = new EditPointView(point, allDestinations, allOffers);

    this.#pointComponent.setEditClickHandler(this.#replacePointToEdit);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editPointComponent.setEditFormClickHandler(this.#handleEditFormClose);
    this.#editPointComponent.setEditFormSubmitHandler(this.#handleEditFormSubmit);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if(prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#tripListContainer);
      return;
    }

    if(this.#mode === Mode.EDIT) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDIT) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDIT) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };


  #handleEditFormClose = () => {
    this.resetView();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #replacePointToEdit = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDIT;
  };

  #replaceEditToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleEditFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  };
}
