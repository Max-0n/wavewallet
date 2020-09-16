require('./style.scss');
import WaveChart from './chartLib';

console.info('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

const chart: WaveChart = new WaveChart(
  [50, 100, 200, 170, 250, 145, 50, 100, 200, 170, 250, 145],
  document.getElementById('chart')
);
