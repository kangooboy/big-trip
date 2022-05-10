import { generatePoint} from '../mock/point.js';

export default class PointsModel {
  #points = Array.from({ length: 3 }, generatePoint);
  get points() {
    return this.#points;
  }
}
