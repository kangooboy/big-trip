import FilterPointView from './view/filter-point-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { render, RenderPosition } from './render.js';
import PointsModel from './model/points-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripHeaderContainer = document.querySelector('.trip-main');
const tripPresenter = new TripPresenter();
const pointsModel = new PointsModel();

render(new TripInfoView(), tripHeaderContainer, RenderPosition.AFTERBEGIN);
render(new FilterPointView(), filterContainer);

tripPresenter.init(tripContainer, pointsModel);
