import { Point } from './interfaces';

// Curve between vertex coordinates
// •|x1,y1] – – – –> [a1,b1]
//    – _
//       \_ _
//            \ _
//                \_
// {a2,b2} <– – – – [x2,y2]•
export default class PathSlice {
  public from: Point;
  public to: Point;
  public view: SVGPathElement;
  public curve: string;

  constructor(from: Point, to: Point) {
    this.from = from;
    this.to = to;
    this.view = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.updateView();
  }

  private getCurvePath(): string {
    return `M ${this.from.x} ${this.from.y}
    C ${this.from.fromX}${this.from.fromY}, ${this.to.fromX}${this.to.fromY},
    ${this.to.x} ${this.to.y}`;
  }

  public updateView(): void {
    this.view.setAttribute('p', this.getCurvePath());
  }
}
