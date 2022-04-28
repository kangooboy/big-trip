import NewPointView from '../view/new-point-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  tripListComponent = new TripListView();

  init = (tripContainer) => {
    this.tripContainer = tripContainer;

    render(new SortPointView(), this.tripContainer);
    render(this.tripListComponent, this.tripContainer);
    render(new EditPointView(), this.tripListComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new PointView(), this.tripListComponent.getElement());
    }

    render(new NewPointView(), this.tripListComponent.getElement());
  };
}
