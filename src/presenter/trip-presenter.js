
import NoPointView from '../view/no-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../util.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #tripHeaderContainer = null;
  #tripListComponent = new TripListView();
  #tripPoints = [];
  #pointPresenter = new Map();

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

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent.element, this.#handlePointChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
