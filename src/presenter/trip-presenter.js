import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripListView from '../view/trip-list-view.js';
import SortPointView from '../view/sort-point-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #tripListComponent = new TripListView();
  #tripPoints = [];

  init = (tripContainer, pointsModel) => {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#tripPoints = [...this.#pointsModel.points];

    render(new SortPointView(), this.#tripContainer);
    render(this.#tripListComponent, this.#tripContainer);

    for(const point of this.#tripPoints) {
      this.#renderPoint(point);
    }
  };

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const editPointView = new EditPointView(point);
    const replacePointToEdit = () => {
      this.#tripListComponent.element.replaceChild(editPointView.element, pointComponent.element);
    };
    const replaceEditToPoint = () => {
      this.#tripListComponent.element.replaceChild(pointComponent.element, editPointView.element);
    };
    const onEscKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointView.element.querySelector('.event__rollup-btn').addEventListener('click', replaceEditToPoint);

    editPointView.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripListComponent.element);
  };
}
