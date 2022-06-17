import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterPointModel extends Observable {
  #filterPoint = FilterType.EVERYTHING;

  get filterPoint() {
    return this.#filterPoint;
  }

  setFilter = (updateType, filterPoint) => {
    this.#filterPoint = filterPoint;
    this._notify(updateType, filterPoint);
  };
}
