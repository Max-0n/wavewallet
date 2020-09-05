// export interface Point {
//   x: number;
//   y: number;
//   value?: number;
//   postfix?: string;
// }

// [50, 100, 200, 170, 230, 145]
// export const createPath = (data: number[]): SVGPathElement => {
//   let path: string = 'M';
//   const line: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//   const width = 600;
//   const height = 600;
//   const stepXSize = 600 / data.length;
//   const stepYSize = (Math.max(...data) - Math.min(...data)) / data.length;
//   const min = 0;
//   const max = Math.max(...data) * 100 / 80;
//
//   data.forEach((val: number, i, arr) => {
//     if (i) {
//       path += ` ${stepXSize * i - 300},${stepYSize * -i}`;
//     } else {
//       path += ` ${stepXSize * i - 300},${stepYSize * -i}`;
//       path += `C ${stepXSize * i - 300},${stepYSize * -i} ${stepXSize * i - 300},${stepYSize * -i}`;
//     }
//   });
//
//   line.setAttribute('d', path); // Set path's data
//   return line;
// };
