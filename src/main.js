import FilterPointView from './view/filter-point-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import PointsModel from './model/points-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter();
const pointsModel = new PointsModel();

render(new FilterPointView(), filterContainer);

tripPresenter.init(tripContainer, pointsModel);
