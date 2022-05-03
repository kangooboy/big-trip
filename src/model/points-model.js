import { generatePoint} from '../mock/point.js';

export default class PointsModel {
  points = Array.from({ length: 5 }, generatePoint);
  getPoints = () => this.points;
}
