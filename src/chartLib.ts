export interface Point {
  x: number;
  y: number;
  radius: number;
  view: SVGCircleElement;
  isPredict?: boolean;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  value?: number;
  postfix?: string;
  activate?: Function;
  deactivate?: Function;
}

export interface Cursor {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  isHold: boolean;
}

export default class WaveChart {
  private values: number[];
  public points: Map<number, Point> = new Map();
  public svgChartElement: HTMLElement;
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
  private cursor: Cursor = {
    startX: 0,
    startY: 0,
    curX: 0,
    curY: 0,
    isHold: false
  };
  private viewIndex: number = 0;

  constructor(values: number[], svg: HTMLElement) {
    this.svgChartElement = svg;
    // this.areaTop.addEventListener('click', this.eventClick);
    // this.areaBottom.addEventListener('click', this.eventClick);

    this.curLine.classList.add('cash_line');

    this.setUp(values);
    this.makeChart();

    // Subscribe to chart cursor events
    this.svgChartElement.addEventListener('mousedown', this.onDragStart, false);
    this.svgChartElement.addEventListener('mousemove', this.onDragMove, false);
    this.svgChartElement.addEventListener('mouseup', this.onDragEnd, false);
    this.svgChartElement.addEventListener('touchstart', this.onDragStart, false);
    this.svgChartElement.addEventListener('touchmove', this.onDragMove, false);
    this.svgChartElement.addEventListener('touchend', this.onDragEnd, false);

    window.addEventListener('resize', this.onResize, false);
  }

  private setUp(values: number[] = this.values) {
    this.min = Math.min(...values);
    this.max = Math.max(...values);
    this.values = values;
    this.stepXSize = Math.round(this.svgChartElement.clientWidth / (this.values.length - 1) * 100) / 100;
    this.stepYSize = (this.svgChartElement.clientHeight - (this.svgChartElement.clientHeight * 0.5)) / 100;

    this.makePoints();

    console.log(Array.from(this.points));
  }

  // private eventClick = (e: MouseEvent): void => {
  //   const element = e.target as SVGPathElement;
  //   element.classList.remove('active');
  //   setTimeout(() => { element.classList.add('active'); });
  //
  //   // console.log(this.svg);
  //   // this.index *= 0.9;
  //   // this.svg.setAttribute('viewBox', `${Math.round(this.svg.clientWidth * (1 - this.index))} ${Math.round(this.svg.clientHeight * (1 - this.index))} ${Math.round(this.svg.clientWidth * this.index)} ${Math.round(this.svg.clientHeight * this.index)}`);
  //   //
  //   // console.log(this.svg.getAttribute('viewBox'));
  // }

  private makeChart(): void {
    let pathCurLine: string;
    this.svgChartElement.appendChild(this.curLine);
    this.svgChartElement.appendChild(this.areaTop);
    this.svgChartElement.appendChild(this.areaBottom);

    this.points.forEach((point: Point) => {
      // if (!point.isPredict) {
      pathCurLine = this.addVertexToPath(point, pathCurLine);
      this.svgChartElement.appendChild(point.view);
    });

    this.curLine.setAttribute('d', pathCurLine);
    this.curFill.setAttribute('d', `${pathCurLine} V 691 H 0 Z`);
    this.curFill.classList.add('cash_fill');
    this.curFill.setAttribute('fill', 'url(#grad)');
    // this.svgChartElement.appendChild(this.curLine);

    // this.predLine.setAttribute('d', pathCurLine);
    // this.predFill.setAttribute('d', pathCurLine);

    this.areaTop.setAttribute('d', `${pathCurLine} V 0 H 0 Z`);
    this.areaTop.classList.add('cash_top');
    this.areaTop.setAttribute('fill', 'url(#gradientTop)');
    // this.svgChartElement.appendChild(this.areaTop);

    this.areaBottom.classList.add('cash_bottom');
    this.areaBottom.setAttribute('fill', 'url(#gradientBottom)');
    this.areaBottom.setAttribute('d', `${pathCurLine} V ${this.svgChartElement.clientHeight} H 0 Z`);
    // this.svgChartElement.appendChild(this.areaBottom);
  }

  private addVertexToPath(point: Point, path: string): string {
    if (!path) {
      path = `M ${point.x},${point.y} C ${point.toX},${point.y}`;
    } else {
      path += ` ${point.fromX},${point.y} ${point.x},${point.y}`;
      if (point.toX) { path += ` C ${point.toX},${point.y}`; }
    }

    return path;
  }

  private makePoints(): void {
    const points: Point[] = this.values.map((value: number, i: number, arr: number[]) => {
      const x: number = Math.trunc(i * this.stepXSize);
      const y: number = Math.trunc((((value - this.min) / (this.max - this.min)) * 100) * this.stepYSize) + (this.svgChartElement.clientHeight * 0.25);
      const radius: number = 5;

      return {
        x,
        y,
        radius,
        value,
        // activate() { console.log(this); },
        activate() {
          this.view.setAttribute('r', `${this.radius * 2}`);
          this.view.classList.add('active');
        },
        deactivate() {
          this.view.setAttribute('r', `${this.radius}`);
          this.view.classList.remove('active');
        },
        view: this.makePointView(x, y, radius),
        fromX: Math.trunc(i * this.stepXSize - (this.stepXSize / 2)),
        toX: arr.length === ++i ? null : Math.trunc(i * this.stepXSize - (this.stepXSize / 2)),
        isPredict: i > arr.length * 0.75
      } as Point;
    });

    points.forEach((point: Point, index: number) => {
      this.points.set(index, point);
    });

    console.info(this.points);
  }

  private makePointView(x: number, y: number, r: number): SVGCircleElement {
    const view = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    view.setAttribute('cx', `${x}`);
    view.setAttribute('cy', `${y}`);
    view.setAttribute('r', `${r}`);

    view.addEventListener('mouseover', () => { view.setAttribute('r', `${r * 2}`); }, false);
    view.addEventListener('mouseout', () => { view.setAttribute('r', `${r}`); }, false);

    return view;
  }

  private onResize = (): void => {
    this.svgChartElement.setAttribute('viewBox', `0 0 ${this.svgChartElement.clientWidth} ${this.svgChartElement.clientHeight}`);
    this.values = this.values.map(() => Math.round(Math.random() * 100));
    this.setUp(this.values);
    this.makeChart();
  }

  private onDragStart = (event: MouseEvent | TouchEvent): void => {
    event.preventDefault();
    this.cursor.isHold = true;
    const pageX: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX : (event as MouseEvent).pageX;
    const pageY: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageY : (event as MouseEvent).pageY;
    this.cursor.startX = this.cursor.curX = pageX;
    this.cursor.startY = this.cursor.curY = pageY;
  }

  private onDragMove = (event: MouseEvent | TouchEvent): void => {
    event.preventDefault();
    if (this.cursor.isHold) {
      const pageX: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX : (event as MouseEvent).pageX;
      const pageY: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageY : (event as MouseEvent).pageY;

      // console.log(this.cursor.curX, pageX);
      this.cursor.curX = pageX;
      this.cursor.curY = pageY;

      if (this.cursor.startX - this.cursor.curX >= 90) {
        new Audio(require('./sounds/swipeStepSound.mp3').default).play();
        this.cursor.startX -= 100;
        this.viewIndex--;
        console.log(this.points.get(this.viewIndex));
        this.points.get(this.points.size - this.viewIndex).activate();
        this.points.get(this.points.size - this.viewIndex + 1).deactivate();
      } else if (this.cursor.startX - this.cursor.curX <= -90) {
        new Audio(require('./sounds/swipeStepSound.mp3').default).play();
        this.cursor.startX += 100;
        this.viewIndex++;
        this.points.get(this.points.size / 2 - this.viewIndex).activate();
        this.points.get(this.points.size / 2 - this.viewIndex - 1).deactivate();
      }

      console.log(this.viewIndex);

      document.getElementById('console').innerHTML = `
      ${this.cursor.isHold}
      <br><b>µ:</b> ${this.cursor.startX - this.cursor.curX}
      <br><b>startX:</b> ${this.cursor.startX}
      <br><b>curX:</b> ${this.cursor.curX}`;

      this.svgChartElement.setAttribute('viewBox', `${((this.cursor.startX - this.cursor.curX) * .5) - this.viewIndex * 100} ${this.cursor.startY - this.cursor.curY} ${this.svgChartElement.clientWidth} ${this.svgChartElement.clientHeight}`);
    }
  }

  private onDragEnd = (event: MouseEvent | TouchEvent): void => {
    event.preventDefault();
    this.cursor.isHold = false;
  }
}
