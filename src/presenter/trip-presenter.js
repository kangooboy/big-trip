
import NoPointView from '../view/no-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem, sortTimeUp,  sortPriceUp} from '../util.js';
import { SortType } from '../const';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #tripHeaderContainer = null;
  #tripListComponent = new TripListView();
  #sortComponent = new SortPointView();
  #tripPoints = [];
  #sourceTripPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(tripContainer, tripHeaderContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#sourceTripPoints = [...this.#pointsModel.points];
    this.#renderTrip();
  };

  #renderTrip = () => {
    if(this.#tripPoints.length === 0) {
      render(new NoPointView(), this.#tripContainer);
    } else {
      render(new TripInfoView(), this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
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

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#tripPoints.sort(sortTimeUp);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortPriceUp);
        break;
      default:
        this.#tripPoints = [...this.#sourceTripPoints];
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

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
