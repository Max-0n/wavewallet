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
  public points: Set<Point> = new Set();
  public svg: HTMLElement;
  public curLine: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public curFill: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public predLine: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public predFill: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public areaTop: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public areaBottom: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  public stepXSize: number;
  public stepYSize: number;
  private min: number;
  private max: number;
  private workarea: number;

  private index = 1;

  constructor(values: number[], svg: HTMLElement) {
    this.svg = svg;
    this.areaTop.addEventListener('click', this.eventClick);
    this.areaBottom.addEventListener('click', this.eventClick);

    this.setUp(values);
    this.drawPaths();
  }

  private setUp(values: number[] = this.values) {
    this.min = Math.min(...values);
    this.max = Math.max(...values);
    this.values = values;
    this.workarea = Math.trunc(this.svg.clientHeight - this.svg.clientHeight * 0.2);
    this.stepXSize = Math.round(this.svg.clientWidth / (this.values.length - 1) * 100) / 100;
    this.stepYSize = (this.svg.clientHeight - (this.svg.clientHeight * 0.5)) / 100;

    this.points = new Set(this.values.map((value: number, i: number, arr: number[]) => {
      return {
        x: Math.trunc(i * this.stepXSize),
        y: Math.trunc((((value - this.min) / (this.max - this.min)) * 100) * this.stepYSize) + (this.svg.clientHeight * 0.25),
        value,
        fromX: Math.trunc(i * this.stepXSize - (this.stepXSize / 2)),
        toX: arr.length === ++i ? null : Math.trunc(i * this.stepXSize - (this.stepXSize / 2)),
        isPredict: i > arr.length * 0.75
      } as Point;
    }));

    console.log(Array.from(this.points)[1]);
  }

  private eventClick = (e: MouseEvent): void => {
    const element = e.target as SVGPathElement;
    element.classList.remove('active');
    setTimeout(() => { element.classList.add('active'); });

    // console.log(this.svg);
    // this.index *= 0.9;
    // this.svg.setAttribute('viewBox', `${Math.round(this.svg.clientWidth * (1 - this.index))} ${Math.round(this.svg.clientHeight * (1 - this.index))} ${Math.round(this.svg.clientWidth * this.index)} ${Math.round(this.svg.clientHeight * this.index)}`);
    //
    // console.log(this.svg.getAttribute('viewBox'));
  }

  private drawPaths(): void {
    let pathCurLine: string;
    // let pathCurFill: string;
    // let pathPredLine: string;
    // let pathPredFill: string;
    // let pathTop: string;
    // let pathBottom: string;

    this.points.forEach((point: Point) => {
      // if (!point.isPredict) {
      pathCurLine = this.addPointToPath(point, pathCurLine);
      // }
      // else {
      //   pathPredLine = this.addPointToPath(point, pathPredLine);
      // }
    });

    this.curLine.setAttribute('d', pathCurLine);
    this.curFill.setAttribute('d', `${pathCurLine} V 691 H 0 Z`);
    this.curFill.classList.add('cash_fill');
    this.curFill.setAttribute('fill', 'url(#grad)');

    this.predLine.setAttribute('d', pathCurLine);
    this.predFill.setAttribute('d', pathCurLine);

    this.areaTop.setAttribute('d', `${pathCurLine} V 0 H 0 Z`);
    this.areaTop.classList.add('cash_top');
    this.areaTop.setAttribute('fill', 'url(#gradientTop)');

    this.areaBottom.classList.add('cash_bottom');
    this.areaBottom.setAttribute('fill', 'url(#gradientBottom)');
    this.areaBottom.setAttribute('d', `${pathCurLine} V ${this.svg.clientHeight} H 0 Z`);
  }

  private addPointToPath(point: Point, path: string): string {
    if (!path) {
      path = `M ${point.x},${point.y} C ${point.toX},${point.y}`;
    } else {
      path += ` ${point.fromX},${point.y} ${point.x},${point.y}`;
      if (point.toX) { path += ` C ${point.toX},${point.y}`; }
    }

    return path;
  }

  public redraw(values: number[]): void {
    this.svg.setAttribute('viewBox', `0 0 ${this.svg.clientWidth} ${this.svg.clientHeight}`);
    this.setUp(values);
    this.drawPaths();
  }
}
