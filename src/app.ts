require('./style.scss');
import WaveChart from './chartLib';

console.info('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

const svgChart: HTMLElement = document.getElementById('chart');
const values: number[] = [50, 100, 200, 170, 250, 145, 50, 100, 200, 170, 250, 145];
// const values: number[] = [0, -100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200];
const chart: WaveChart = new WaveChart(values, document.getElementById('chart'));
chart.curLine.classList.add('cash_line');


window.addEventListener('resize', () => {
  chart.redraw();
});

// svgChart.appendChild(chart.curFill);
// svgChart.appendChild(chart.predLine);
// svgChart.appendChild(chart.predFill);
svgChart.appendChild(chart.areaTop);
svgChart.appendChild(chart.areaBottom);
svgChart.appendChild(chart.curLine);
