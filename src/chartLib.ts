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

// [50, 100, 200, 170, 250, 145]
export default class WaveChart {
  private values: number[];
  public points: Set<Point>;
  public svg: HTMLElement;
  public curLine: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public curFill: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public predLine: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public predFill: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public stepXSize: number;
  public stepYSize: number;
  private min: number;
  private max: number;
  private workarea: number;

  constructor(values: number[], svg: HTMLElement) {
    this.svg = svg;
    this.values = values;
    this.min = Math.min(...values);
    this.max = Math.max(...values);

    this.setUp();
    this.drawPaths();
  }

  private setUp() {
    this.workarea = Math.trunc(this.svg.clientHeight - this.svg.clientHeight * 0.2);
    this.stepXSize = Math.round(this.svg.clientWidth / (this.values.length - 1) * 100) / 100;
    this.stepYSize = (this.svg.clientHeight - (this.svg.clientHeight * 0.1)) / 100;
    // console.log(this.svg.clientWidth, this.values.length, this.stepXSize);
    // console.log(this.svg.clientHeight, this.min, this.stepYSize, this.max - this.min);

    this.points = new Set(this.values.map((value: number, i: number, arr: number[]) => {
      return {
        x: Math.trunc(i * this.stepXSize),
        y: Math.trunc(((value * 100) / (this.max - this.min)) * this.stepYSize + (this.svg.clientHeight * 0.05)),
        value,
        fromX: Math.trunc(i * this.stepXSize - (this.stepXSize / 2)),
        toX: arr.length === ++i ? null : Math.trunc(i * this.stepXSize - (this.stepXSize / 2)),
        isPredict: i > arr.length * 0.75
      } as Point;
    }));
  }

  // path.cash_line(d="M -100,100 C -50,100 -50,0 0,0 C 100,0 100,-200 200,-200")
  private drawPaths(): void {
    let path: string;

    this.points.forEach((point: Point) => {
      if (!path) {
        path = `M ${point.x},${point.y} C ${point.toX},${point.y}`;
      } else {
        path += ` ${point.fromX},${point.y} ${point.x},${point.y}`;
        if (point.toX) { path += ` C ${point.toX},${point.y}`; }
      }
    });

    this.curLine.setAttribute('d', path);
  }

  public redraw(): void {
    this.svg.setAttribute('viewBox', `0 0 ${this.svg.clientWidth} ${this.svg.clientHeight}`);
    this.setUp();
    this.drawPaths();
  }
}
