export interface Point {
  x: number;
  y: number;
  isPredict?: boolean;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  value?: number;
  postfix?: string;
}

// [50, 100, 200, 170, 230, 145]
export default class WaveChart {
  public width: number;
  public height: number;
  public points: Set<Point>;
  public svg: HTMLElement;
  public curLine: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public curFill: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public predLine: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public predFill: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public stepXSize: number;
  public stepYSize: number;
  // public min = Math.max(...data) - Math.min(...data) / 80;
  // public max = (Math.max(...data) * 100) / 80;


  constructor(values: number[], svg: HTMLElement) {
    this.svg = svg;
    this.stepXSize = svg.clientWidth / 2 / values.length;
    this.stepYSize = svg.clientHeight / 2 / values.length;
    console.info(svg.clientWidth, svg.clientHeight);
    // this.width = width;
    // this.height = height;
    this.points = new Set(values.map((value: number, i: number) => {
      return {
        x: Math.trunc(i * this.stepXSize),
        y: Math.trunc(value * this.stepYSize),
        value,
        fromX: Math.trunc(i * this.stepXSize - this.stepXSize / 2),
        toX: Math.trunc(i * this.stepXSize + this.stepXSize / 2)
      } as Point;
    }));

    values.forEach((value: number, i: number, arr: number[]) => {
      this.points.add({
        x: Math.trunc(this.points.size * this.stepXSize),
        y: Math.trunc(value * this.stepYSize),
        value,
        fromX: Math.trunc((this.points.size + 1) * this.stepXSize - this.stepXSize / 2),
        toX: arr.length === ++i ? null : Math.trunc((this.points.size + 1) * this.stepXSize + this.stepXSize / 2),
        isPredict: true
      } as Point);
    });

    this.drawPaths();
  }

  // path.cash_line(d="M -100,100 C -50,100 -50,0 0,0 C 100,0 100,-200 200,-200")
  private drawPaths(): void {
    console.info(this.points);
    let path: string;

    this.points.forEach((point: Point) => {
      // console.info(point);
      if (!path) {
        path = `M ${point.x},${point.y} C ${point.toX},${point.y}`;
      } else {
        path += ` ${point.fromX},${point.y} ${point.x},${point.y}`;
        if (point.toX) { path += ` C ${point.toX},${point.y}`; }
      }
      // if (!point.isPredict) {
      //   console.info(point);
      // } else {
      //   console.info('point');
      // }
    });

    console.info(path);
    this.curLine.setAttribute('d', path);
  }
}
