export interface Point {
  x: number;
  y: number;
  radius?: number;
  view?: SVGCircleElement;
  isPredict?: boolean;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  value?: number;
  postfix?: string;
  activate?(): void;
  deactivate?(): void;
}

export interface Cursor {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  isHold: boolean;
}
