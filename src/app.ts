require('./style.scss');
import WaveChart from './chartLib';

console.info('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

const svgGroup: HTMLElement = document.getElementById('chartGroup');
const values: number[] = [50, 100, 200, 170, 230, 145];
const chart: WaveChart = new WaveChart(values, document.getElementById('chart'));
chart.curLine.classList.add('cash_line');

svgGroup.appendChild(chart.curLine);
svgGroup.appendChild(chart.curFill);
svgGroup.appendChild(chart.predLine);
svgGroup.appendChild(chart.predFill);
