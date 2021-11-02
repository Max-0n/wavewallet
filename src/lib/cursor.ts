export default class Cursor {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  isHold: boolean;

  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.curX = 0;
    this.curY = 0;
    this.isHold = false;
  }
}
