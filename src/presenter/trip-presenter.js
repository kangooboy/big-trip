
import NoPointView from '../view/no-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import PointNewPresenter from '../presenter/point-new-presenter.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortByDay, sortByTime, sortByPrice} from '../util.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { filter } from '../util.js';
import dayjs from 'dayjs';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #tripHeaderContainer = null;
  #tripListComponent = new TripListView();
  #sortComponent = null;
  #infoComponent = null;
  #loadingComponent = new LoadingView();
  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #noPointComponent = null;
  #filterModel = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(tripContainer, tripHeaderContainer, filterModel, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointNewPresenter = new PointNewPresenter(this.#tripListComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  }

  init = () => {
    this.#renderTrip();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback, this.#pointsModel.allDestinations, this.#pointsModel.allOffers);
  };

  #renderTrip = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.points.length === 0) {
      this.#renderTripInfo();
      this.#renderTripList();
      this.#renderNoPointComponent();
    } else {
      this.#renderTripInfo();
      this.#renderSort();
      this.#renderTripList();

      for(const point of this.points) {
        this.#renderPoint(point);
      }
    }
  };

  #renderTripList = () => {
    render(this.#tripListComponent, this.#tripContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoPointComponent = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#tripContainer);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.allDestinations, this.#pointsModel.allOffers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripInfo = () => {
    const points = [...this.points];
    const allOffers = [...this.#pointsModel.allOffers];
    let tripTitle = '';
    let tripDate = '';

    if(points.length > 0) {
      points.sort(sortByDay);
      const startPoint = points[0].destination.name;
      const endPoint = points[points.length - 1].destination.name;
      const dateFrom = dayjs(points[0].dateFrom).format('D MMMM');
      const dateTo = dayjs(points[points.length - 1].dateTo).format('D MMMM');

      if(points.length === 1) {
        tripTitle = startPoint;
        tripDate = dateFrom;
      }
      if(points.length === 2) {
        tripTitle = `${startPoint} ${String.fromCharCode(0x2014)} ${endPoint}`;
        tripDate = `${dateFrom} ${String.fromCharCode(0x2014)} ${dateTo}`;
      }
      if(points.length === 3) {
        const secondPoint = points[1].destination.name;
        tripTitle = `${startPoint} ${String.fromCharCode(0x2014)} ${secondPoint} ${String.fromCharCode(0x2014)} ${endPoint}`;
        tripDate = `${dateFrom} ${String.fromCharCode(0x2014)} ${dateTo}`;
      }
      if(points.length > 3) {
        tripTitle = `${startPoint} ${String.fromCharCode(0x2026)} ${endPoint}`;
        tripDate = `${dateFrom} ${String.fromCharCode(0x2014)} ${dateTo}`;
      }
      if(dateFrom === dateTo) {
        tripDate = dateFrom;
      }
    }

    const allPrices = [];
    for(const point of points) {
      const offerIndex = allOffers.findIndex((item) => item.type === point.type);
      const pointAllOffers = allOffers[offerIndex].offers;
      const targetOffers = pointAllOffers.filter((item) => point.offers.some((el) => item.id === el));
      targetOffers.forEach((item) => allPrices.push(item.price));
    }
    points.forEach((item) => allPrices.push(item.basePrice));
    const tripCost = allPrices.reduce((prev, curr) => prev + curr, 0);

    this.#infoComponent = new TripInfoView(tripTitle, tripDate, tripCost);
    render(this.#infoComponent, this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTrip();
  };

  #renderSort = () => {
    this.#sortComponent = new SortPointView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer);
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#infoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };
}
