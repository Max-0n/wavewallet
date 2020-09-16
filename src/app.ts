require('./style.scss');
import WaveChart from './chartLib';

console.info('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

const svgChart: HTMLElement = document.getElementById('chart');
const values: number[] = [50, 100, 200, 170, 250, 145, 50, 100, 200, 170, 250, 145];
// const values: number[] = [0, -100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200];
const chart: WaveChart = new WaveChart(values, document.getElementById('chart'));
chart.curLine.classList.add('cash_line');


window.addEventListener('resize', () => {
  chart.redraw(values.map(val => Math.round(Math.random() * 100)));
});

// svgChart.appendChild(chart.curFill);
// svgChart.appendChild(chart.predLine);
// svgChart.appendChild(chart.predFill);
svgChart.appendChild(chart.areaTop);
svgChart.appendChild(chart.areaBottom);
svgChart.appendChild(chart.curLine);


const consoleDiv = document.getElementById('console');
const mouse = {
  startX: 0,
  startY: 0,
  curX: 0,
  curY: 0,
  hold: false
};

window.onmousedown = onDragStart;
window.onmousemove = onDragMove;
window.onmouseup = onDragEnd;

document.addEventListener('touchstart', onDragStart, false);
document.addEventListener('touchmove', onDragMove, false);
document.addEventListener('touchend', onDragEnd, false);


function onDragStart(event: MouseEvent | TouchEvent): void {
  event.preventDefault();
  mouse.hold = true;
  const pageX: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX : (event as MouseEvent).pageX;
  const pageY: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageY : (event as MouseEvent).pageY;
  mouse.startX = mouse.curX = pageX;
  mouse.startY = mouse.curY = pageY;

  showPosition();
}

function onDragMove(event: MouseEvent | TouchEvent): void {
  event.preventDefault();
  if (mouse.hold) {
    const pageX: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX : (event as MouseEvent).pageX;
    const pageY: number = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageY : (event as MouseEvent).pageY;

    mouse.curX = pageX;
    mouse.curY = pageY;

    showPosition();
  }
}

function onDragEnd(event: MouseEvent | TouchEvent): void {
  event.preventDefault();
  mouse.hold = false;

  showPosition.call(this);
}

function showPosition(): void {
  console.log(`start: ${mouse.startX}/${mouse.startY}`);
  console.log(`curre: ${mouse.curX}/${mouse.curY}`);
  consoleDiv.innerHTML = `${mouse.hold}: ${mouse.startX - mouse.curX}/${mouse.startY - mouse.curY}`;
  svgChart.setAttribute('viewBox', `${mouse.startX - mouse.curX} ${mouse.startY - mouse.curY} ${svgChart.clientWidth} ${svgChart.clientHeight}`);
}
