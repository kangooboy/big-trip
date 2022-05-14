import FilterPointView from './view/filter-point-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import { FILTERS } from './const.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripHeaderContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const pointsCount = pointsModel.points.length;
const tripPresenter = new TripPresenter(tripContainer, tripHeaderContainer, pointsModel);

render(new FilterPointView(FILTERS, pointsCount), filterContainer);

tripPresenter.init();
