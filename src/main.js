import FilterFormView from './view/filter-event-view.js';

import ListContainerPresenter from './presenter/list-container-presenter.js';
import { render } from './render.js';

const filterFormContainer = document.querySelector('.trip-controls__filters');
const filterSortContainer = document.querySelector('.trip-events');
const listContainerPresenter = new ListContainerPresenter;

render(new FilterFormView, filterFormContainer);

listContainerPresenter.init(filterSortContainer);
