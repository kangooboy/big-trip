import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterPointModel from './model/filter-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripHeaderContainer = document.querySelector('.trip-main');
const newPointButtonComponent = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterPointModel();
const tripPresenter = new TripPresenter(tripContainer, tripHeaderContainer, filterModel, pointsModel);
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);

const handleNewPointFormClose = () => {
  newPointButtonComponent.disabled = false;
};
const handleNewPointButtonClick = () => {
  tripPresenter.createTask(handleNewPointFormClose);
  newPointButtonComponent.disabled = true;
};
newPointButtonComponent.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
tripPresenter.init();
