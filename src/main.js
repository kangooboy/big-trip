import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterPointModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './points-api-service.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripHeaderContainer = document.querySelector('.trip-main');

const AUTHORIZATION = 'Basic hsKJB88KLndN4Nj';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const newPointButtonComponent = new NewPointButtonView();
const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterPointModel();
const tripPresenter = new TripPresenter(tripContainer, tripHeaderContainer, filterModel, pointsModel);
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, tripHeaderContainer);
newPointButtonComponent.setNewPointClickHandler(handleNewPointButtonClick);

filterPresenter.init();
tripPresenter.init();
pointsModel.init();
