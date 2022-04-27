import NewPointView from '../view/new-point-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-event-view.js';
import ListView from '../view/list-view.js';
import SortFormView from '../view/sort-event-view.js';
import { render } from '../render.js';

export default class ListContainerPresenter {
  listComponent = new ListView();

  init = (listContainer) => {
    this.listContainer = listContainer;

    render(new SortFormView(), this.listContainer);
    render(this.listComponent, this.listContainer);
    render(new EditFormView(), this.listComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }

    render(new NewPointView(), this.listComponent.getElement());
  };
}
