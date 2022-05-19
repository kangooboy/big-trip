
import NoPointView from '../view/no-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem, sortByDay, sortByTime, sortByPrice} from '../util.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #tripHeaderContainer = null;
  #tripListComponent = new TripListView();
  #sortComponent = new SortPointView();
  #infoComponent = new TripInfoView();
  #tripPoints = [];
  #pointPresenter = new Map();

  constructor(tripContainer, tripHeaderContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points].sort(sortByDay);
    this.#renderTrip();
  };

  #renderTrip = () => {
    if(this.#tripPoints.length === 0) {
      render(new NoPointView(), this.#tripContainer);
    } else {
      this.#renderTripInfo();
      this.#renderSort();
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

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripInfo = () => {
    render(this.#infoComponent, this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case 'day':
        this.#tripPoints.sort(sortByDay);
        break;
      case 'time':
        this.#tripPoints.sort(sortByTime);
        break;
      case 'price':
        this.#tripPoints.sort(sortByPrice);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    sortType = sortType.split('-')[1];

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderTrip();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
