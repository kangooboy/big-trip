import PointView from '../view/point-view.js';
import NoPointView from '../view/no-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition, replace } from '../framework/render.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #tripHeaderContainer = null;
  #tripListComponent = new TripListView();
  #tripPoints = [];

  constructor(tripContainer, tripHeaderContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#renderTrip();
  };

  #renderTrip = () => {
    if(this.#tripPoints.length === 0) {
      render(new NoPointView(), this.#tripContainer);
    } else {
      render(new TripInfoView(), this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
      render(new SortPointView(), this.#tripContainer);
      render(this.#tripListComponent, this.#tripContainer);

      for(const point of this.#tripPoints) {
        this.#renderPoint(point);
      }
    }
  };

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const editPointView = new EditPointView(point);
    const replacePointToEdit = () => {
      replace(editPointView, pointComponent);
    };
    const replaceEditToPoint = () => {
      replace(pointComponent, editPointView);
    };
    const onEscKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointView.setEditFormClickHandler(replaceEditToPoint);

    editPointView.setEditFormSubmitHandler(() => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripListComponent.element);
  };
}
