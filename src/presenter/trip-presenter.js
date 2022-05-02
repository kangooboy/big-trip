import NewPointView from '../view/new-point-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  tripListComponent = new TripListView();

  init = (tripContainer, pointsModel) => {
    this.tripPoints = [...pointsModel.getPoints()];

    render(new SortPointView(), tripContainer);
    render(this.tripListComponent, tripContainer);
    render(new EditPointView(this.tripPoints[0]), this.tripListComponent.getElement());

    for(let i = 0; i < this.tripPoints.length; i++) {
      render(new PointView(this.tripPoints[i]), this.tripListComponent.getElement());
    }

    render(new NewPointView(), this.tripListComponent.getElement());
  };
}
