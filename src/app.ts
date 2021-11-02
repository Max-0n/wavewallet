require('./style.scss');
import WaveChart from './lib/waveChart';

const version: string = document.getElementsByTagName('html')[0].getAttribute('version');
console.info(`%cCreated by Max0n #${version}`, 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

document.getElementsByTagName('title')[0].innerHTML = `💹 WaveWallet ${version}`;

const chart: WaveChart = new WaveChart(
  [50, 100, 200, 170, 250, 145, 50, 100, 200, 170, 250, 145].map(() => Math.round(Math.random() * 100)),
  document.getElementById('chart')
);
